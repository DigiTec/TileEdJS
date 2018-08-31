export abstract class XmlParserHelpers {
  static safeNodeValue(node: HTMLElement, itemName: string): string {
    const attrs = node.attributes;
    const item = attrs.getNamedItem(itemName);
    if (item !== null && item.nodeValue !== null) {
      return item.nodeValue;
    } else {
      return "";
    }
  }
}
