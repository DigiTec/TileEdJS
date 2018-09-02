"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XmlParserHelpers_1 = require("./XmlParserHelpers");
class TMXGroup {
    constructor(tmxMap) {
        this.offsetX = 0;
        this.offsetY = 0;
        this.opacity = 1;
        this.visible = true;
        this.map = tmxMap;
    }
    import(groupNode) {
        this.parseAttributes(groupNode);
    }
    parseAttributes(currentNode) {
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(currentNode, "name");
        this.offsetX = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "offsetx", 0);
        this.offsetY = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "offsety", 0);
        this.opacity = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "opacity", 1);
        this.visible =
            XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "visible", 1) == 1;
    }
}
exports.TMXGroup = TMXGroup;
//# sourceMappingURL=TMXGroup.js.map