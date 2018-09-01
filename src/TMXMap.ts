import { TMXImporter } from "./TMXImporter";
import { TMXLayer } from "./TMXLayer";
import { XmlParserHelpers } from "./XmlParserHelpers";
import { TMXTileSet } from "./TMXTileSet";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { TMXObjectGroup } from "./TMXObjectGroup";

export class TMXMap {
  private importer: TMXImporter;
  private tileSets: Array<TMXTileSet> = new Array<TMXTileSet>();
  private layers: Array<TMXLayer | TMXObjectGroup> = new Array<
    TMXLayer | TMXObjectGroup
  >();

  public mapProperties?: TMXPropertyMap;
  public cellsX: number = 0;
  public cellsY: number = 0;
  public tileHeight: number = 0;
  public tileWidth: number = 0;

  constructor(tmxImporter: TMXImporter) {
    this.importer = tmxImporter;
  }

  importMap(mapNode: Element): void {
    if (this.isSupported(mapNode)) {
      this.parseMapData(mapNode);
      for (let i = 0; i < mapNode.childNodes.length; i++) {
        const childNode = mapNode.childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          switch (childNode.localName) {
            case "tileset":
              const newTileSet = new TMXTileSet(this);
              newTileSet.importTileSet(<Element>childNode);
              this.tileSets.push(newTileSet);
              break;
            case "layer":
              const newLayer = new TMXLayer(this);
              newLayer.importLayer(<Element>childNode);
              this.layers.push(newLayer);
              break;
            case "objectgroup":
              const newObjectGroup = new TMXObjectGroup(this);
              newObjectGroup.importObjectGroup(<Element>childNode);
              this.layers.push(newObjectGroup);
              break;
            case "properties":
              if (this.mapProperties) {
                throw "Duplicate properties definition for map";
              }
              this.mapProperties = new TMXPropertyMap();
              this.mapProperties.importProperties(<Element>childNode);
              break;
          }
        }
      }
    } else {
      throw "Unsupported mapElement. Check version and orienation.";
    }
  }

  private parseMapData(mapNode: Element): void {
    this.cellsX = parseInt(XmlParserHelpers.safeNodeValue(mapNode, "width"));
    this.cellsY = parseInt(XmlParserHelpers.safeNodeValue(mapNode, "height"));
    this.tileWidth = parseInt(
      XmlParserHelpers.safeNodeValue(mapNode, "tilewidth")
    );
    this.tileHeight = parseInt(
      XmlParserHelpers.safeNodeValue(mapNode, "tileheight")
    );
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

  private isSupported(mapNode: Element) {
    return (
      XmlParserHelpers.safeNodeValue(mapNode, "version") === "1.0" &&
      XmlParserHelpers.safeNodeValue(mapNode, "orientation") === "orthogonal"
    );
  }

  get layerCount(): number {
    return this.layers.length;
  }
}
