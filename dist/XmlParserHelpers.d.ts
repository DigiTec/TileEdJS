export declare abstract class XmlParserHelpers {
    static requiredNodeValue(node: Element, itemName: string): string;
    static requiredAttrValue(attrs: NamedNodeMap, itemName: string): string;
    static requiredNodeInteger(node: Element, itemName: string): number;
    static requiredAttrInteger(attrs: NamedNodeMap, itemName: string): number;
    static defaultedNodeValue(node: Element, itemName: string, defaultValue: string): string;
    static defaultedAttrValue(attrs: NamedNodeMap, itemName: string, defaultValue: string): string;
    static defaultedNodeInteger(node: Element, itemName: string, defaultValue: number): number;
    static defaultedAttrInteger(attrs: NamedNodeMap, itemName: string, defaultValue: number): number;
}
//# sourceMappingURL=XmlParserHelpers.d.ts.map