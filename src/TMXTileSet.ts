﻿import { TMXMap } from "./TMXMap";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { XmlParserHelpers } from "./XmlParserHelpers";

export class TMXTileSet {
  private map: TMXMap;
  private debugName: string = "<unknown>";
  private tileProperties: Array<TMXPropertyMap>;

  private firstGid: number = -1;
  private lastGid: number = -1;

  private tileWidth: number = -1;
  private tileHeight: number = -1;
  private imageSource: string = "";
  private imageWidth: number = -1;
  private imageHeight: number = -1;
  private cellColumns: number = -1;
  private cellRows: number = -1;

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
    this.tileProperties = new Array<TMXPropertyMap>();
  }

  public import(tileSetNode: Element) {
    if (tileSetNode.hasAttribute("source")) {
      throw "TSX files in the source attribute are not supported.";
    }

    const attrs = tileSetNode.attributes;
    this.firstGid = XmlParserHelpers.requiredAttrInteger(attrs, "firstgid");
    this.debugName = XmlParserHelpers.requiredAttrValue(attrs, "name");
    this.tileWidth = XmlParserHelpers.requiredAttrInteger(attrs, "tilewidth");
    this.tileHeight = XmlParserHelpers.requiredAttrInteger(attrs, "tileheight");

    for (
      let tileSetChildIndex = 0;
      tileSetChildIndex < tileSetNode.childNodes.length;
      tileSetChildIndex++
    ) {
      const childNode = tileSetNode.childNodes[tileSetChildIndex];
      if (childNode.nodeType == Node.ELEMENT_NODE) {
        const childAttrs = (<Element>childNode).attributes;
        switch (childNode.localName) {
          case "image":
            this.imageSource = this.map.mapTileSetSourceToUrl(
              XmlParserHelpers.requiredAttrValue(childAttrs, "source")
            );
            this.imageWidth = XmlParserHelpers.requiredAttrInteger(
              childAttrs,
              "width"
            );
            this.imageHeight = XmlParserHelpers.requiredAttrInteger(
              childAttrs,
              "height"
            );
            this.cellColumns = this.imageWidth / this.tileWidth;
            this.cellRows = this.imageHeight / this.tileHeight;
            this.lastGid = this.firstGid + this.cellColumns * this.cellRows - 1;
            break;

          case "tile":
            var localId = XmlParserHelpers.requiredAttrInteger(
              childAttrs,
              "id"
            );
            for (
              let tileChildIndex = 0;
              tileChildIndex < childNode.childNodes.length;
              tileChildIndex++
            ) {
              const tileChildNode = childNode.childNodes[tileChildIndex];
              if (tileChildNode.nodeType == Node.ELEMENT_NODE) {
                switch (tileChildNode.localName) {
                  case "properties":
                    this.tileProperties[localId] = new TMXPropertyMap();
                    this.tileProperties[localId].import(<Element>tileChildNode);
                    break;

                  case "image":
                  case "objecgroup":
                  case "animation":
                    throw `Library does not currently support the <${
                      tileChildNode.localName
                    }> element inside of <tile>`;

                  default:
                    throw `Unknown child node for <tile> properties in TMXTileSet: localName = ${
                      tileChildNode.localName
                    }`;
                }
              }
            }
            break;

          default:
            throw `Unknown child node in TMXTileSet: localName = ${
              childNode.localName
            }`;
        }
      }
    }
  }

  public containsTile(gid: number): boolean {
    return gid >= this.firstGid && gid <= this.lastGid;
  }

  public getTileRenderData(gid: number) {
    var offsetGid = gid - this.firstGid;
    var xCell = offsetGid % this.cellColumns;
    var yCell = (offsetGid / this.cellColumns) | 0;

    if (yCell < this.cellRows) {
      return {
        left: xCell * this.tileWidth,
        top: yCell * this.tileHeight,
        width: this.tileWidth,
        height: this.tileHeight
      };
    } else {
      throw "Tile out of range";
    }
  }

  public getTileProperties(gid: number): TMXPropertyMap {
    var localId = gid - this.firstGid;
    return this.tileProperties[localId];
  }

  public renderTileToCanvas(
    gid: number,
    drawCtx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    xDest: number,
    yDest: number
  ): void {
    const renderData = this.getTileRenderData(gid);
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

  public renderTileToCSSBackgroundImage(gid: number): string {
    var renderData = this.getTileRenderData(gid);
    return `(${this.cssUrl} ${-renderData.left}px ${-renderData.top}px`;
  }

  public get cssUrl(): string {
    return `url(${this.imageSource})`;
  }

  public get imageUrl(): string {
    return this.imageSource;
  }
}
