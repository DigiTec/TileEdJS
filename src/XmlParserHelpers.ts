export abstract class XmlParserHelpers {
  static requiredNodeValue(node: Element, itemName: string): string {
    return XmlParserHelpers.requiredAttrValue(node.attributes, itemName);
  }
  static requiredAttrValue(attrs: NamedNodeMap, itemName: string): string {
    const item = attrs.getNamedItem(itemName);
    if (item === null || item.nodeValue === null) {
      throw "Required attribute " + itemName + " doesn't exist on the node.";
    } else {
      return item.nodeValue;
    }
  }
  static requiredNodeInteger(node: Element, itemName: string): number {
    return this.requiredAttrInteger(node.attributes, itemName);
  }
  static requiredAttrInteger(attrs: NamedNodeMap, itemName: string): number {
    return parseInt(XmlParserHelpers.requiredAttrValue(attrs, itemName));
  }

  static defaultedNodeValue(
    node: Element,
    itemName: string,
    defaultValue: string
  ): string {
    return XmlParserHelpers.defaultedAttrValue(
      node.attributes,
      itemName,
      defaultValue
    );
  }
  static defaultedAttrValue(
    attrs: NamedNodeMap,
    itemName: string,
    defaultValue: string
  ): string {
    const item = attrs.getNamedItem(itemName);
    if (item !== null && item.nodeValue !== null) {
      return item.nodeValue;
    } else {
      return defaultValue;
    }
  }

  static defaultedNodeInteger(
    node: Element,
    itemName: string,
    defaultValue: number
  ): number {
    return XmlParserHelpers.defaultedAttrInteger(
      node.attributes,
      itemName,
      defaultValue
    );
  }
  static defaultedAttrInteger(
    attrs: NamedNodeMap,
    itemName: string,
    defaultValue: number
  ): number {
    const item = attrs.getNamedItem(itemName);
    if (item === null || item.nodeValue === null) {
      return defaultValue;
    } else {
      return parseInt(item.nodeValue);
    }
  }

  static safeNodeValue(node: Element, itemName: string): string {
    return XmlParserHelpers.safeAttrValue(node.attributes, itemName);
  }
  static safeAttrValue(attrs: NamedNodeMap, itemName: string): string {
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
