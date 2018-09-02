import { XmlParserHelpers } from "./XmlParserHelpers";

export class TMXPropertyMap {
  constructor() {}
  public import(propertiesNode: Element) {
    for (let i = 0; i < propertiesNode.childNodes.length; i++) {
      const childNode = propertiesNode.childNodes[i];
      if (childNode.nodeType == Node.ELEMENT_NODE) {
        const childElement = childNode as Element;
        switch (childNode.localName) {
          case "property":
            Object.defineProperty(
              this,
              XmlParserHelpers.safeNodeValue(childElement, "name"),
              {
                value: XmlParserHelpers.safeNodeValue(childElement, "value"),
                configurable: false,
                writable: true,
                enumerable: true
              }
            );
            break;
          default:
            throw "Unsupported node in property map: localName = " +
              childNode.localName;
        }
      }
    }
  }
}
