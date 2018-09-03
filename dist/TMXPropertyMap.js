"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XmlParserHelpers_1 = require("./XmlParserHelpers");
class TMXPropertyMap {
    constructor() { }
    import(propertiesNode) {
        for (let i = 0; i < propertiesNode.childNodes.length; i++) {
            const childNode = propertiesNode.childNodes[i];
            if (childNode.nodeType == Node.ELEMENT_NODE) {
                const childElement = childNode;
                switch (childNode.localName) {
                    case "property":
                        Object.defineProperty(this, XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(childElement, "name"), {
                            value: XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(childElement, "value"),
                            configurable: false,
                            writable: true,
                            enumerable: true
                        });
                        break;
                    default:
                        throw "Unsupported node in property map: localName = " +
                            childNode.localName;
                }
            }
        }
    }
}
exports.TMXPropertyMap = TMXPropertyMap;
//# sourceMappingURL=TMXPropertyMap.js.map