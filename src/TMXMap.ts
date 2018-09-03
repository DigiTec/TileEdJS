import { TMXImageLayer } from "./TMXImageLayer";
import { TMXImporter } from "./TMXImporter";
import { TMXLayer } from "./TMXLayer";
import { XmlParserHelpers } from "./XmlParserHelpers";
import { TMXTileSet } from "./TMXTileSet";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { TMXObjectGroup } from "./TMXObjectGroup";
import { TMXGroup } from "./TMXGroup";

declare type ValidMapLayers =
  | TMXLayer
  | TMXObjectGroup
  | TMXImageLayer
  | TMXGroup;

export class TMXMap {
  private importer: TMXImporter;

  public tileSets: Array<TMXTileSet> = new Array<TMXTileSet>();
  public layers: Array<ValidMapLayers> = new Array<ValidMapLayers>();
  public mapProperties?: TMXPropertyMap;

  // Direct attributes from the <map> node.
  public version: string = "";
  public tileEdVersion: string = "";
  public orientation: string = "";
  public renderOrder: string = "";

  public cellsX: number = -1;
  public cellsY: number = -1;
  public tileHeight: number = -1;
  public tileWidth: number = -1;

  constructor(tmxImporter: TMXImporter) {
    this.importer = tmxImporter;
  }

  importMap(mapNode: Element): void {
    this.parseAttributes(mapNode);
    for (let i = 0; i < mapNode.childNodes.length; i++) {
      const childNode = mapNode.childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        switch (childNode.localName) {
          case "properties":
            if (this.mapProperties) {
              throw "Duplicate properties definition for map";
            }
            this.mapProperties = new TMXPropertyMap();
            this.mapProperties.import(<Element>childNode);
            break;
          case "tileset":
            const newTileSet = new TMXTileSet(this);
            newTileSet.import(<Element>childNode);
            this.tileSets.push(newTileSet);
            break;
          case "layer":
            const newLayer = new TMXLayer(this);
            newLayer.import(<Element>childNode);
            this.layers.push(newLayer);
            break;
          case "objectgroup":
            const newObjectGroup = new TMXObjectGroup(this);
            newObjectGroup.import(<Element>childNode);
            this.layers.push(newObjectGroup);
            break;
          case "imagelayer":
            const newImageLayer = new TMXImageLayer(this);
            newImageLayer.import(<Element>childNode);
            this.layers.push(newImageLayer);
            break;
          case "group":
            const newGroup = new TMXGroup(this);
            newGroup.import(<Element>childNode);
            this.layers.push(newGroup);
            break;

          default:
            throw "Unsupported child node type in map " + childNode.localName;
        }
      }
    }
  }

  private parseAttributes(mapNode: Element): void {
    const attrs = mapNode.attributes;
    this.version = XmlParserHelpers.requiredAttrValue(attrs, "version");
    this.tileEdVersion = XmlParserHelpers.defaultedAttrValue(
      attrs,
      "tiledversion",
      "<unknown>"
    );
    this.orientation = XmlParserHelpers.requiredAttrValue(attrs, "orientation");
    this.renderOrder = XmlParserHelpers.defaultedAttrValue(
      attrs,
      "renderorder",
      "right-down"
    );

    this.cellsX = XmlParserHelpers.requiredAttrInteger(attrs, "width");
    this.cellsY = XmlParserHelpers.requiredAttrInteger(attrs, "height");
    this.tileWidth = XmlParserHelpers.requiredAttrInteger(attrs, "tilewidth");
    this.tileHeight = XmlParserHelpers.requiredAttrInteger(attrs, "tileheight");

    if (this.version !== "1.0" || this.orientation !== "orthogonal") {
      throw "Unsupported mapElement. Check version and orienation.";
    }
  }

  public mapTileSetSourceToUrl(rawUrl: string): string {
    return this.importer.mapTileSetSourceToUrl(rawUrl);
  }

  public getTileProperties(gid: number): TMXPropertyMap {
    for (var i = 0; i < this.tileSets.length; i++) {
      if (this.tileSets[i].containsTile(gid)) {
        return this.tileSets[i].getTileProperties(gid);
      }
    }
    throw "Tile " + gid + " not found in any of the existing tile sets.";
  }

  public renderTileToCanvas(
    gid: number,
    drawCtx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    xDest: number,
    yDest: number
  ): void {
    for (var i = 0; i < this.tileSets.length; i++) {
      if (this.tileSets[i].containsTile(gid)) {
        var renderData = this.tileSets[i].getTileRenderData(gid);
        if (renderData) {
          drawCtx.drawImage(
            image,
            renderData.left,
            renderData.top,
            renderData.width,
            renderData.height,
            xDest,
            yDest,
            renderData.width,
            renderData.height
          );
        }
        break;
      }
    }
  }

  renderTileToCSSBackgroundImage(gid: number): string | undefined {
    for (var i = 0; i < this.tileSets.length; i++) {
      if (this.tileSets[i].containsTile(gid)) {
        var renderData = this.tileSets[i].getTileRenderData(gid);
        if (renderData) {
          return (
            this.tileSets[i].cssUrl +
            " " +
            -renderData.left +
            "px " +
            -renderData.top +
            "px"
          );
        }
        break;
      }
    }
    return undefined;
  }

  get layerCount(): number {
    return this.layers.length;
  }
}
