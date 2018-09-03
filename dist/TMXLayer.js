"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base64_1 = require("./Base64");
const TMXLayerEncoding_1 = require("./TMXLayerEncoding");
const TMXPropertyMap_1 = require("./TMXPropertyMap");
const TMXTile_1 = require("./TMXTile");
const XmlParserHelpers_1 = require("./XmlParserHelpers");
class TMXLayer {
    constructor(tmxMap) {
        this.debugName = "";
        this.cellsX = -1;
        this.cellsY = -1;
        this.map = tmxMap;
        this.tiles = new Array();
    }
    import(layerNode) {
        this.parseAttributes(layerNode);
        for (let layerNodeChildIndex = 0; layerNodeChildIndex < layerNode.childNodes.length; layerNodeChildIndex++) {
            const layerNodeChild = layerNode.childNodes[layerNodeChildIndex];
            if (layerNodeChild.nodeType == Node.ELEMENT_NODE) {
                const layerNodeElement = layerNodeChild;
                switch (layerNodeChild.localName) {
                    case "data":
                        this.layerEncoding = TMXLayerEncoding_1.TMXLayerEncoding.Xml;
                        if (layerNodeElement.hasAttribute("compression")) {
                            throw "Compression is not supported at this time for compression type " +
                                XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(layerNodeElement, "compression");
                        }
                        if (layerNodeElement.hasAttribute("encoding")) {
                            const encodingType = XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(layerNodeElement, "encoding");
                            switch (encodingType) {
                                case "csv":
                                    this.layerEncoding = TMXLayerEncoding_1.TMXLayerEncoding.Csv;
                                    break;
                                case "base64":
                                    this.layerEncoding = TMXLayerEncoding_1.TMXLayerEncoding.Base64;
                                    break;
                                default:
                                    throw "Unsupported encoding type " + encodingType;
                            }
                        }
                        switch (this.layerEncoding) {
                            case TMXLayerEncoding_1.TMXLayerEncoding.Xml:
                                this.importXMLLayer(layerNodeElement);
                                break;
                            case TMXLayerEncoding_1.TMXLayerEncoding.Csv:
                                this.importCSVLayer(layerNodeElement);
                                break;
                            case TMXLayerEncoding_1.TMXLayerEncoding.Base64:
                                this.importBase64Layer(layerNodeElement);
                                break;
                        }
                        break;
                    case "properties":
                        if (this.layerProperties) {
                            throw "Duplicate properties definition for layer " +
                                this.debugName;
                        }
                        this.layerProperties = new TMXPropertyMap_1.TMXPropertyMap();
                        this.layerProperties.import(layerNodeElement);
                        break;
                    default:
                        throw "Unsupported node in layer: localName = " +
                            layerNodeChild.localName;
                        break;
                }
            }
        }
    }
    parseAttributes(currentNode) {
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.defaultedNodeValue(currentNode, "name", "");
        this.cellsX = XmlParserHelpers_1.XmlParserHelpers.requiredNodeInteger(currentNode, "width");
        this.cellsY = XmlParserHelpers_1.XmlParserHelpers.requiredNodeInteger(currentNode, "height");
    }
    importXMLLayer(dataNode) {
        var cellX = 0;
        var cellY = 0;
        for (let dataNodeChildIndex = 0; dataNodeChildIndex < dataNode.childNodes.length; dataNodeChildIndex++) {
            const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
            if (dataNodeChild.nodeType == Node.ELEMENT_NODE) {
                switch (dataNodeChild.localName) {
                    case "tile":
                        var newTile = new TMXTile_1.TMXTile(XmlParserHelpers_1.XmlParserHelpers.requiredNodeInteger(dataNodeChild, "gid"), cellX++, cellY);
                        this.tiles.push(newTile);
                        break;
                    default:
                        throw "Unsupported node in layer data block: localName = " +
                            dataNodeChild.localName;
                        break;
                }
                if (cellX === this.cellsX) {
                    cellX = 0;
                    cellY++;
                }
            }
        }
    }
    importCSVLayer(dataNode) {
        var cellX = 0;
        var cellY = 0;
        for (let dataNodeChildIndex = 0; dataNodeChildIndex < dataNode.childNodes.length; dataNodeChildIndex++) {
            const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
            if (dataNodeChild.nodeType == Node.TEXT_NODE) {
                const tileIds = dataNodeChild.nodeValue.split(",");
                for (const tileIdString of tileIds) {
                    const newTile = new TMXTile_1.TMXTile(parseInt(tileIdString), cellX++, cellY);
                    this.tiles.push(newTile);
                    if (cellX === this.cellsX) {
                        cellX = 0;
                        cellY++;
                    }
                }
            }
        }
    }
    importBase64Layer(dataNode) {
        var cellX = 0;
        var cellY = 0;
        for (let dataNodeChildIndex = 0; dataNodeChildIndex < dataNode.childNodes.length; dataNodeChildIndex++) {
            const dataNodeChild = dataNode.childNodes[dataNodeChildIndex];
            if (dataNodeChild.nodeType == Node.TEXT_NODE) {
                const bytes = Base64_1.Base64.decode(dataNodeChild.nodeValue);
                for (let i = 0; i < bytes.length; i += 4) {
                    const tileId = bytes.charCodeAt(i) +
                        (bytes.charCodeAt(i + 1) << 8) +
                        (bytes.charCodeAt(i + 2) << 16) +
                        (bytes.charCodeAt(i + 3) << 24);
                    const newTile = new TMXTile_1.TMXTile(tileId, cellX++, cellY);
                    this.tiles.push(newTile);
                    if (cellX === this.cellsX) {
                        cellX = 0;
                        cellY++;
                    }
                }
            }
        }
    }
    get name() {
        return this.debugName;
    }
}
exports.TMXLayer = TMXLayer;
//# sourceMappingURL=TMXLayer.js.map