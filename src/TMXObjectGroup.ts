import { TMXMap } from "./TMXMap";
import { TMXObject } from "./TMXObject";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { XmlParserHelpers } from "./XmlParserHelpers";

export class TMXObjectGroup {
  private map: TMXMap;
  private groupProperties?: TMXPropertyMap;
  private objects: Array<TMXObject> = new Array<TMXObject>();
  private objectNameMap: Map<string, TMXObject> = new Map<string, TMXObject>();
  private objectTypeMap: Map<string, Array<TMXObject>> = new Map<
    string,
    Array<TMXObject>
  >();

  private debugName: string = "<unknown>";
  private cellsX: number = -1;
  private cellsY: number = -1;

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
  }

  public importObjectGroup(objectGroupNode: Element) {
    this.debugName = XmlParserHelpers.safeNodeValue(objectGroupNode, "name");
    this.cellsX = XmlParserHelpers.safeNodeInteger(objectGroupNode, "width");
    this.cellsY = XmlParserHelpers.safeNodeInteger(objectGroupNode, "height");

    for (
      let objectGroupChildIndex = 0;
      objectGroupChildIndex < objectGroupNode.childNodes.length;
      objectGroupChildIndex++
    ) {
      const objectChildeNode =
        objectGroupNode.childNodes[objectGroupChildIndex];
      if (objectChildeNode.nodeType == Node.ELEMENT_NODE) {
        switch (objectChildeNode.localName) {
          case "properties":
            if (this.groupProperties) {
              throw "Duplicate properties definition for object group layer " +
                this.debugName;
            }
            this.groupProperties = new TMXPropertyMap();
            this.groupProperties.import(<Element>(
              objectChildeNode
            ));
            break;

          case "object":
            const newObject = new TMXObject(this.map);
            newObject.importObject(<Element>objectChildeNode);

            this.objects.push(newObject);
            this.objectNameMap.set(newObject.name, newObject);

            if (!this.objectTypeMap.has(newObject.objectType)) {
              this.objectTypeMap.set(
                newObject.objectType,
                new Array<TMXObject>()
              );
            }
            (<Array<TMXObject>>this.objectTypeMap.get(newObject.objectType)).push(newObject);
            break;

          default:
            throw "Unsupported node in object group layer: localName = " +
              objectChildeNode.localName;
        }
      }
    }
  }

  public get name(): string {
    return this.debugName;
  }
}
