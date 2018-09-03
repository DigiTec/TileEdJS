import { TMXMap } from "./TMXMap";
import { XmlParserHelpers } from "./XmlParserHelpers";
import { TMXPropertyMap } from "./TMXPropertyMap";

export class TMXObject {
  private map: TMXMap;
  private uniqueId: number = -1;
  private debugName: string = "";
  private tileId: number = -1;
  private absoluteX: number = -1;
  private absoluteY: number = -1;
  private absoluteWidth: number = -1;
  private absoluteHeight: number = -1;
  private objectProperties?: TMXPropertyMap;

  public objectType: string = "";

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
  }

  public import(objectNode: Element): void {
    this.parseAttributes(objectNode);

    for (
      let objectChildNodeIndex = 0;
      objectChildNodeIndex < objectNode.childNodes.length;
      objectChildNodeIndex++
    ) {
      const objectChildNode = objectNode.childNodes[objectChildNodeIndex];
      if (objectChildNode.nodeType == Node.ELEMENT_NODE) {
        switch (objectChildNode.localName) {
          case "properties":
            if (this.objectProperties) {
              throw "Duplicate properties definition for object " +
                this.debugName;
            }
            this.objectProperties = new TMXPropertyMap();
            this.objectProperties.import(<Element>objectChildNode);
            break;

          default:
            throw "Unsupported node in object: localName = " +
              objectChildNode.localName;
        }
      }
    }
  }

  private parseAttributes(currentNode: Element): void {
    this.uniqueId = XmlParserHelpers.defaultedNodeInteger(currentNode, "id", -1);
    this.debugName = XmlParserHelpers.requiredNodeValue(currentNode, "name");
    this.objectType = XmlParserHelpers.requiredNodeValue(currentNode, "type");

    // Objects are either lose and have odd shapes not aligned to cells or they
    // have tileId's and would have cell based properties. For now, import absolute
    // coordinates.
    this.absoluteX = XmlParserHelpers.requiredNodeInteger(currentNode, "x");
    this.absoluteY = XmlParserHelpers.requiredNodeInteger(currentNode, "y");

    this.absoluteWidth = XmlParserHelpers.defaultedNodeInteger(
      currentNode,
      "width",
      0
    );
    this.absoluteHeight = XmlParserHelpers.defaultedNodeInteger(
      currentNode,
      "height",
      0
    );
    this.tileId = XmlParserHelpers.defaultedNodeInteger(currentNode, "gid", -1);
  }

  // Properties
  public get name(): string {
    return this.debugName;
  }

  public get isTileObject(): boolean {
    if (this.tileId) {
      return true;
    } else {
      return false;
    }
  }
}
