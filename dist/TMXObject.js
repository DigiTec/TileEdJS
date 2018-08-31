"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XmlParserHelpers_1 = require("./XmlParserHelpers");
const TMXPropertyMap_1 = require("./TMXPropertyMap");
class TMXObject {
    constructor(tmxMap) {
        this.debugName = "";
        this.tileId = -1;
        this.absoluteX = -1;
        this.absoluteY = -1;
        this.absoluteWidth = -1;
        this.absoluteHeight = -1;
        this.objectType = "";
        this.map = tmxMap;
    }
    importObject(objectNode) {
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(objectNode, "name");
        this.objectType = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(objectNode, "type");
        // Objects are either lose and have odd shapes not aligned to cells or they
        // have tileId's and would have cell based properties. For now, import absolute
        // coordinates.
        this.absoluteX = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectNode, "x");
        this.absoluteY = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectNode, "y");
        if (objectNode.hasAttribute("width")) {
            this.absoluteWidth = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectNode, "width");
        }
        if (objectNode.hasAttribute("height")) {
            this.absoluteHeight = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectNode, "height");
        }
        if (objectNode.hasAttribute("gid")) {
            this.tileId = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectNode, "gid");
        }
        for (let objectChildNodeIndex = 0; objectChildNodeIndex < objectNode.childNodes.length; objectChildNodeIndex++) {
            const objectChildNode = objectNode.childNodes[objectChildNodeIndex];
            if (objectChildNode.nodeType == Node.ELEMENT_NODE) {
                switch (objectChildNode.localName) {
                    case "properties":
                        if (this.objectProperties) {
                            throw "Duplicate properties definition for object " +
                                this.debugName;
                        }
                        this.objectProperties = new TMXPropertyMap_1.TMXPropertyMap();
                        this.objectProperties.importProperties((objectChildNode));
                        break;
                    default:
                        throw "Unsupported node in object: localName = " +
                            objectChildNode.localName;
                }
            }
        }
    }
    // Properties
    get name() {
        return this.debugName;
    }
    get isTileObject() {
        if (this.tileId) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.TMXObject = TMXObject;
//# sourceMappingURL=TMXObject.js.map