"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XmlParserHelpers {
    static requiredNodeValue(node, itemName) {
        return XmlParserHelpers.requiredAttrValue(node.attributes, itemName);
    }
    static requiredAttrValue(attrs, itemName) {
        const item = attrs.getNamedItem(itemName);
        if (item === null || item.nodeValue === null) {
            throw "Required attribute " + itemName + " doesn't exist on the node.";
        }
        else {
            return item.nodeValue;
        }
    }
    static requiredNodeInteger(node, itemName) {
        return this.requiredAttrInteger(node.attributes, itemName);
    }
    static requiredAttrInteger(attrs, itemName) {
        return parseInt(XmlParserHelpers.requiredAttrValue(attrs, itemName));
    }
    static defaultedNodeValue(node, itemName, defaultValue) {
        return XmlParserHelpers.defaultedAttrValue(node.attributes, itemName, defaultValue);
    }
    static defaultedAttrValue(attrs, itemName, defaultValue) {
        const item = attrs.getNamedItem(itemName);
        if (item !== null && item.nodeValue !== null) {
            return item.nodeValue;
        }
        else {
            return defaultValue;
        }
    }
    static defaultedNodeInteger(node, itemName, defaultValue) {
        return XmlParserHelpers.defaultedAttrInteger(node.attributes, itemName, defaultValue);
    }
    static defaultedAttrInteger(attrs, itemName, defaultValue) {
        const item = attrs.getNamedItem(itemName);
        if (item === null || item.nodeValue === null) {
            return defaultValue;
        }
        else {
            return parseInt(item.nodeValue);
        }
    }
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