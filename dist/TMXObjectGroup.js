"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMXObject_1 = require("./TMXObject");
const TMXPropertyMap_1 = require("./TMXPropertyMap");
const XmlParserHelpers_1 = require("./XmlParserHelpers");
class TMXObjectGroup {
    constructor(tmxMap) {
        this.objects = new Array();
        this.objectNameMap = new Map();
        this.objectTypeMap = new Map();
        this.debugName = "";
        this.deprecatedTileX = -1;
        this.deprecatedTileY = -1;
        this.deprecatedTileWidth = -1;
        this.deprecatedTileHeight = -1;
        this.opacity = 1;
        this.visible = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.drawOrder = "topdown";
        this.map = tmxMap;
    }
    import(objectGroupNode) {
        this.parseAttributes(objectGroupNode);
        for (let objectGroupChildIndex = 0; objectGroupChildIndex < objectGroupNode.childNodes.length; objectGroupChildIndex++) {
            const objectChildeNode = objectGroupNode.childNodes[objectGroupChildIndex];
            if (objectChildeNode.nodeType == Node.ELEMENT_NODE) {
                switch (objectChildeNode.localName) {
                    case "properties":
                        if (this.groupProperties) {
                            throw "Duplicate properties definition for object group layer " +
                                this.debugName;
                        }
                        this.groupProperties = new TMXPropertyMap_1.TMXPropertyMap();
                        this.groupProperties.import((objectChildeNode));
                        break;
                    case "object":
                        const newObject = new TMXObject_1.TMXObject(this.map);
                        newObject.import(objectChildeNode);
                        this.objects.push(newObject);
                        this.objectNameMap.set(newObject.name, newObject);
                        if (!this.objectTypeMap.has(newObject.objectType)) {
                            this.objectTypeMap.set(newObject.objectType, new Array());
                        }
                        this.objectTypeMap.get(newObject.objectType).push(newObject);
                        break;
                    default:
                        throw "Unsupported node in object group layer: localName = " +
                            objectChildeNode.localName;
                }
            }
        }
    }
    parseAttributes(currentNode) {
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeValue(currentNode, "name", "");
        this.deprecatedTileX = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "x", 0);
        this.deprecatedTileY = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "y", 0);
        this.deprecatedTileWidth = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "width", 0);
        this.deprecatedTileHeight = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "height", 0);
        this.opacity = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "opacity", 1);
        this.visible = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "visible", 1) === 1;
        this.offsetX = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "offsetX", 0);
        this.offsetY = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeInteger(currentNode, "offsetY", 0);
        this.drawOrder = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeValue(currentNode, "draworder", "topdown") === "topdown" ? "topdown" : "index";
    }
    get name() {
        return this.debugName;
    }
}
exports.TMXObjectGroup = TMXObjectGroup;
//# sourceMappingURL=TMXObjectGroup.js.map