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
        this.debugName = "<unknown>";
        this.cellsX = -1;
        this.cellsY = -1;
        this.map = tmxMap;
    }
    importObjectGroup(objectGroupNode) {
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(objectGroupNode, "name");
        this.cellsX = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectGroupNode, "width");
        this.cellsY = XmlParserHelpers_1.XmlParserHelpers.safeNodeInteger(objectGroupNode, "height");
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
                        this.groupProperties.importProperties((objectChildeNode));
                        break;
                    case "object":
                        const newObject = new TMXObject_1.TMXObject(this.map);
                        newObject.importObject(objectChildeNode);
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
    get name() {
        return this.debugName;
    }
}
exports.TMXObjectGroup = TMXObjectGroup;
//# sourceMappingURL=TMXObjectGroup.js.map