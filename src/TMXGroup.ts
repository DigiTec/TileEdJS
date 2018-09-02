import { TMXMap } from "./TMXMap";
import { XmlParserHelpers } from "./XmlParserHelpers";

export class TMXGroup {
  private map: TMXMap;

  private debugName?: string;

  public offsetX: number = 0;
  public offsetY: number = 0;
  public opacity: number = 1;
  public visible: boolean = true;

  constructor(tmxMap: TMXMap) {
    this.map = tmxMap;
  }

  public import(groupNode: Element): void {
    this.parseAttributes(groupNode);
  }

  private parseAttributes(currentNode: Element): void {
    this.debugName = XmlParserHelpers.requiredNodeValue(currentNode, "name");
    this.offsetX = XmlParserHelpers.defaultedNodeInteger(
      currentNode,
      "offsetx",
      0
    );
    this.offsetY = XmlParserHelpers.defaultedNodeInteger(
      currentNode,
      "offsety",
      0
    );
    this.opacity = XmlParserHelpers.defaultedNodeInteger(
      currentNode,
      "opacity",
      1
    );
    this.visible =
      XmlParserHelpers.defaultedNodeInteger(currentNode, "visible", 1) == 1;
  }
}
