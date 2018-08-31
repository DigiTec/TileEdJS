import { TMXImporter } from "./TMXImporter";
import { XmlParserHelpers } from "./XmlParserHelpers";
import { TMXTileSet } from "./TMXTileSet";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { TMXObjectGroup } from "./TMXObjectGroup";

export class TMXMap {
  private importer: TMXImporter;
  private _tileSets: Array<any> = [];
  private _layers: Array<any> = [];

  public mapProperties?: TMXPropertyMap;
  public cellsX: number = 0;
  public cellsY: number = 0;
  public tileHeight: number = 0;
  public tileWidth: number = 0;

  constructor(tmxImporter: TMXImporter) {
    this.importer = tmxImporter;
  }

  importMap(mapNode: HTMLElement): void {
    if (this.isSupported(mapNode)) {
      this.parseMapData(mapNode);
      for (let i = 0; i < mapNode.childNodes.length; i++) {
        const childNode = mapNode.childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          switch (childNode.localName) {
            case "tileset":
              const newTileSet = new TMXTileSet(this);
              newTileSet.importTileSet(<HTMLElement>childNode);
              this._tileSets.push(newTileSet);
              break;
            case "layer":
              const newLayer = new (<any>window).TMXLayer(this);
              newLayer.importLayer(childNode);
              this._layers.push(newLayer);
              break;
            case "objectgroup":
              const newObjectGroup = new TMXObjectGroup(this);
              newObjectGroup.importObjectGroup(<HTMLElement>childNode);
              this._layers.push(newObjectGroup);
              break;
            case "properties":
              if (this.mapProperties) {
                throw "Duplicate properties definition for map";
              }
              this.mapProperties = new TMXPropertyMap();
              this.mapProperties.importProperties(<HTMLElement>childNode);
              break;
          }
        }
      }
    } else {
      throw "Unsupported mapElement. Check version and orienation.";
    }
  }

  private parseMapData(mapNode: HTMLElement): void {
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

  public getTileProperties(gid: any) {
    for (var i = 0; i < this._tileSets.length; i++) {
      if (this._tileSets[i].containsTile(gid)) {
        return this._tileSets[i].getTileProperties(gid);
      }
    }
  }

  public renderTileToCanvas(
    gid: number,
    drawCtx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    xDest: number,
    yDest: number
  ) {
    for (var i = 0; i < this._tileSets.length; i++) {
      if (this._tileSets[i].containsTile(gid)) {
        var renderData = this._tileSets[i].getTileRenderData(gid);
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
    for (var i = 0; i < this._tileSets.length; i++) {
      if (this._tileSets[i].containsTile(gid)) {
        var renderData = this._tileSets[i].getTileRenderData(gid);
        if (renderData) {
          return (
            this._tileSets[i].cssUrl +
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

  private isSupported(mapNode: HTMLElement) {
    return (
      XmlParserHelpers.safeNodeValue(mapNode, "version") === "1.0" &&
      XmlParserHelpers.safeNodeValue(mapNode, "orientation") === "orthogonal"
    );
  }

  get layerCount(): number {
    return this._layers.length;
  }
}
