export abstract class XmlParserHelpers {
  static safeNodeValue(node: Element, itemName: string): string {
    return XmlParserHelpers.safeAttrValue(node.attributes, itemName);
  }
  static safeAttrValue(attrs: NamedNodeMap, itemName: string) {
    const item = attrs.getNamedItem(itemName);
    if (item !== null && item.nodeValue !== null) {
      return item.nodeValue;
    } else {
      return "";
    }
  }

  static safeNodeInteger(node: Element, itemName: string): number {
    return parseInt(XmlParserHelpers.safeNodeValue(node, itemName));
  }
  static safeAttrInteger(attrs: NamedNodeMap, itemName: string): number {
    return parseInt(XmlParserHelpers.safeAttrValue(attrs, itemName));
  }
}
