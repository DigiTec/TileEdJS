import { Base64 } from "./Base64";
import { TMXLayerEncoding } from "./TMXLayerEncoding";
import { TMXMap } from "./TMXMap";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { TMXTile } from "./TMXTile";
import { XmlParserHelpers } from "./XmlParserHelpers";

export class TMXLayer {
  private map: TMXMap;
  private tiles: Array<TMXTile>;
  private debugName: string = "";
  private cellsX: number = -1;
  private cellsY: number = -1;
  private layerEncoding?: TMXLayerEncoding;
  private layerProperties?: TMXPropertyMap;

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
    this.tiles = new Array<TMXTile>();
  }

  public import(layerNode: Element): void {
    this.parseAttributes(layerNode);

    for (
      let layerNodeChildIndex = 0;
      layerNodeChildIndex < layerNode.childNodes.length;
      layerNodeChildIndex++
    ) {
      const layerNodeChild = layerNode.childNodes[layerNodeChildIndex];
      if (layerNodeChild.nodeType == Node.ELEMENT_NODE) {
        const layerNodeElement = <Element>layerNodeChild;
        switch (layerNodeChild.localName) {
          case "data":
            this.layerEncoding = TMXLayerEncoding.Xml;
            if (layerNodeElement.hasAttribute("compression")) {
              throw "Compression is not supported at this time for compression type " +
                XmlParserHelpers.requiredNodeValue(
                  layerNodeElement,
                  "compression"
                );
            }

            if (layerNodeElement.hasAttribute("encoding")) {
              const encodingType = XmlParserHelpers.requiredNodeValue(
                layerNodeElement,
                "encoding"
              );
              switch (encodingType) {
                case "csv":
                  this.layerEncoding = TMXLayerEncoding.Csv;
                  break;
                case "base64":
                  this.layerEncoding = TMXLayerEncoding.Base64;
                  break;
                default:
                  throw "Unsupported encoding type " + encodingType;
              }
            }

            switch (this.layerEncoding) {
              case TMXLayerEncoding.Xml:
                this.importXMLLayer(layerNodeElement);
                break;
              case TMXLayerEncoding.Csv:
                this.importCSVLayer(layerNodeElement);
                break;
              case TMXLayerEncoding.Base64:
                this.importBase64Layer(layerNodeElement);
                break;
            }
            break;

          case "properties":
            if (this.layerProperties) {
              throw "Duplicate properties definition for layer " +
                this.debugName;
            }
            this.layerProperties = new TMXPropertyMap();
            this.layerProperties.import(layerNodeElement);
            break;

          default:
            throw "Unsupported node in layer: localName = " +
              layerNodeChild.localName;
            break;
        }
      }
    }
  }

  private parseAttributes(currentNode: Element): void {
    this.debugName = XmlParserHelpers.defaultedNodeValue(
      currentNode,
      "name",
      ""
    );
    this.cellsX = XmlParserHelpers.requiredNodeInteger(currentNode, "width");
    this.cellsY = XmlParserHelpers.requiredNodeInteger(currentNode, "height");
  }

  private importXMLLayer(dataNode: Element): void {
    var cellX = 0;
    var cellY = 0;

    for (
      let dataNodeChildIndex = 0;
      dataNodeChildIndex < dataNode.childNodes.length;
      dataNodeChildIndex++
    ) {
      const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
      if (dataNodeChild.nodeType == Node.ELEMENT_NODE) {
        switch (dataNodeChild.localName) {
          case "tile":
            var newTile = new TMXTile(
              XmlParserHelpers.requiredNodeInteger(<Element>dataNodeChild, "gid"),
              cellX++,
              cellY
            );
            this.tiles.push(newTile);
            break;
          default:
            throw "Unsupported node in layer data block: localName = " +
              dataNodeChild.localName;
            break;
        }
        if (cellX === this.cellsX) {
          cellX = 0;
          cellY++;
        }
      }
    }
  }

  private importCSVLayer(dataNode: Element): void {
    var cellX = 0;
    var cellY = 0;

    for (
      let dataNodeChildIndex = 0;
      dataNodeChildIndex < dataNode.childNodes.length;
      dataNodeChildIndex++
    ) {
      const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
      if (dataNodeChild.nodeType == Node.TEXT_NODE) {
        const tileIds = dataNodeChild.nodeValue!.split(",");
        for (const tileIdString of tileIds) {
          const newTile = new TMXTile(parseInt(tileIdString), cellX++, cellY);
          this.tiles.push(newTile);
          if (cellX === this.cellsX) {
            cellX = 0;
            cellY++;
          }
        }
      }
    }
  }

  private importBase64Layer(dataNode: Element): void {
    var cellX = 0;
    var cellY = 0;

    for (
      let dataNodeChildIndex = 0;
      dataNodeChildIndex < dataNode.childNodes.length;
      dataNodeChildIndex++
    ) {
      const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
      if (dataNodeChild.nodeType == Node.TEXT_NODE) {
        const bytes = Base64.decode(dataNodeChild.nodeValue!);
        for (let i = 0; i < bytes.length; i += 4) {
          const tileId =
            bytes.charCodeAt(i) +
            (bytes.charCodeAt(i + 1) << 8) +
            (bytes.charCodeAt(i + 2) << 16) +
            (bytes.charCodeAt(i + 3) << 24);

          const newTile = new TMXTile(tileId, cellX++, cellY);
          this.tiles.push(newTile);
          if (cellX === this.cellsX) {
            cellX = 0;
            cellY++;
          }
        }
      }
    }
  }

  public get name(): string {
    return this.debugName;
  }
}
