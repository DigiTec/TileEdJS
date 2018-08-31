"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XmlParserHelpers {
    static safeNodeValue(node, itemName) {
        return XmlParserHelpers.safeAttrValue(node.attributes, itemName);
    }
    static safeAttrValue(attrs, itemName) {
        const item = attrs.getNamedItem(itemName);
        if (item !== null && item.nodeValue !== null) {
            return item.nodeValue;
        }
        else {
            return "";
        }
    }
    static safeNodeInteger(node, itemName) {
        return parseInt(XmlParserHelpers.safeNodeValue(node, itemName));
    }
    static safeAttrInteger(attrs, itemName) {
        return parseInt(XmlParserHelpers.safeAttrValue(attrs, itemName));
    }
}
exports.XmlParserHelpers = XmlParserHelpers;
//# sourceMappingURL=XmlParserHelpers.js.map