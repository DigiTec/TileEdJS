"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XmlParserHelpers = /** @class */ (function () {
    function XmlParserHelpers() {
    }
    XmlParserHelpers.safeNodeValue = function (node, itemName) {
        var attrs = node.attributes;
        var item = attrs.getNamedItem(itemName);
        if (item !== null && item.nodeValue !== null) {
            return item.nodeValue;
        }
        else {
            return "";
        }
    };
    return XmlParserHelpers;
}());
exports.XmlParserHelpers = XmlParserHelpers;
//# sourceMappingURL=XmlParserHelpers.js.map