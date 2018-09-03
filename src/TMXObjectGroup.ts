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

  private debugName: string = "";
  private deprecatedTileX: number = -1;
  private deprecatedTileY: number = -1;
  private deprecatedTileWidth: number = -1;
  private deprecatedTileHeight: number = -1;
  private opacity: number = 1;
  private visible: boolean = true;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private drawOrder: "index" | "topdown" = "topdown";

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
  }

  public import(objectGroupNode: Element) {
    this.parseAttributes(objectGroupNode);
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
            newObject.import(<Element>objectChildeNode);

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

  private parseAttributes(currentNode: Element): void {
    this.debugName = XmlParserHelpers.defaultedNodeValue(currentNode, "name", "");
    this.deprecatedTileX = XmlParserHelpers.defaultedNodeInteger(currentNode, "x", 0);
    this.deprecatedTileY = XmlParserHelpers.defaultedNodeInteger(currentNode, "y", 0);
    this.deprecatedTileWidth = XmlParserHelpers.defaultedNodeInteger(currentNode, "width", 0);
    this.deprecatedTileHeight = XmlParserHelpers.defaultedNodeInteger(currentNode, "height", 0);
    this.opacity = XmlParserHelpers.defaultedNodeInteger(currentNode, "opacity", 1);
    this.visible = XmlParserHelpers.defaultedNodeInteger(currentNode, "visible", 1) === 1;
    this.offsetX = XmlParserHelpers.defaultedNodeInteger(currentNode, "offsetX", 0);
    this.offsetY = XmlParserHelpers.defaultedNodeInteger(currentNode, "offsetY", 0);
    this.drawOrder = XmlParserHelpers.defaultedNodeValue(currentNode, "draworder", "topdown") === "topdown" ? "topdown" : "index";
  }

  public get name(): string {
    return this.debugName;
  }
}
