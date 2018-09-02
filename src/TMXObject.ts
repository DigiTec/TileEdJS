import { TMXMap } from "./TMXMap";
import { XmlParserHelpers } from "./XmlParserHelpers";
import { TMXPropertyMap } from "./TMXPropertyMap";

export class TMXObject {
  private map: TMXMap;
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

  public importObject(objectNode: Element): void {
    this.debugName = XmlParserHelpers.safeNodeValue(objectNode, "name");
    this.objectType = XmlParserHelpers.safeNodeValue(objectNode, "type");

    // Objects are either lose and have odd shapes not aligned to cells or they
    // have tileId's and would have cell based properties. For now, import absolute
    // coordinates.
    this.absoluteX = XmlParserHelpers.safeNodeInteger(objectNode, "x");
    this.absoluteY = XmlParserHelpers.safeNodeInteger(objectNode, "y");

    if (objectNode.hasAttribute("width")) {
      this.absoluteWidth = XmlParserHelpers.safeNodeInteger(
        objectNode,
        "width"
      );
    }
    if (objectNode.hasAttribute("height")) {
      this.absoluteHeight = XmlParserHelpers.safeNodeInteger(
        objectNode,
        "height"
      );
    }
    if (objectNode.hasAttribute("gid")) {
      this.tileId = XmlParserHelpers.safeNodeInteger(objectNode, "gid");
    }

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
            this.objectProperties.import(<Element>(
              objectChildNode
            ));
            break;

          default:
            throw "Unsupported node in object: localName = " +
              objectChildNode.localName;
        }
      }
    }
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
