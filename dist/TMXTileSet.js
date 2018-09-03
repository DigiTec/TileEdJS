"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMXPropertyMap_1 = require("./TMXPropertyMap");
const XmlParserHelpers_1 = require("./XmlParserHelpers");
class TMXTileSet {
    constructor(tmxMap) {
        this.debugName = "<unknown>";
        this.firstGid = -1;
        this.lastGid = -1;
        this.tileWidth = -1;
        this.tileHeight = -1;
        this.imageSource = "";
        this.imageWidth = -1;
        this.imageHeight = -1;
        this.cellColumns = -1;
        this.cellRows = -1;
        this.map = tmxMap;
        this.tileProperties = new Array();
    }
    importTileSet(tileSetNode) {
        if (tileSetNode.hasAttribute("source")) {
            throw "TSX files such as " +
                XmlParserHelpers_1.XmlParserHelpers.requiredNodeValue(tileSetNode, "source") +
                " are not supported";
        }
        const attrs = tileSetNode.attributes;
        this.firstGid = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(attrs, "firstgid");
        this.debugName = XmlParserHelpers_1.XmlParserHelpers.requiredAttrValue(attrs, "name");
        this.tileWidth = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(attrs, "tilewidth");
        this.tileHeight = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(attrs, "tileheight");
        for (let tileSetChildIndex = 0; tileSetChildIndex < tileSetNode.childNodes.length; tileSetChildIndex++) {
            const childNode = tileSetNode.childNodes[tileSetChildIndex];
            if (childNode.nodeType == Node.ELEMENT_NODE) {
                const childAttrs = childNode.attributes;
                switch (childNode.localName) {
                    case "image":
                        this.imageSource = this.map.mapTileSetSourceToUrl(XmlParserHelpers_1.XmlParserHelpers.requiredAttrValue(childAttrs, "source"));
                        this.imageWidth = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(childAttrs, "width");
                        this.imageHeight = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(childAttrs, "height");
                        this.cellColumns = this.imageWidth / this.tileWidth;
                        this.cellRows = this.imageHeight / this.tileHeight;
                        this.lastGid = this.firstGid + this.cellColumns * this.cellRows - 1;
                        break;
                    case "tile":
                        var localId = XmlParserHelpers_1.XmlParserHelpers.requiredAttrInteger(childAttrs, "id");
                        for (let tileChildIndex = 0; tileChildIndex < childNode.childNodes.length; tileChildIndex++) {
                            const tileChildNode = childNode.childNodes[tileChildIndex];
                            if (tileChildNode.nodeType == Node.ELEMENT_NODE) {
                                switch (tileChildNode.localName) {
                                    case "properties":
                                        this.tileProperties[localId] = new TMXPropertyMap_1.TMXPropertyMap();
                                        this.tileProperties[localId].import((tileChildNode));
                                        break;
                                    default:
                                        throw "Unsupported child node for tile properties in TMXTileSet: localName = " +
                                            tileChildNode.localName;
                                }
                            }
                        }
                        break;
                    default:
                        throw "Unsupported child node in TMXTileSet: localName = " +
                            childNode.localName;
                }
            }
        }
    }
    containsTile(gid) {
        return gid >= this.firstGid && gid <= this.lastGid;
    }
    getTileRenderData(gid) {
        var offsetGid = gid - this.firstGid;
        var xCell = offsetGid % this.cellColumns;
        var yCell = (offsetGid / this.cellColumns) | 0;
        if (yCell < this.cellRows) {
            return {
                left: xCell * this.tileWidth,
                top: yCell * this.tileHeight,
                width: this.tileWidth,
                height: this.tileHeight
            };
        }
        else {
            throw "Tile out of range";
        }
    }
    getTileProperties(gid) {
        var localId = gid - this.firstGid;
        return this.tileProperties[localId];
    }
    renderTileToCanvas(gid, drawCtx, image, xDest, yDest) {
        const renderData = this.getTileRenderData(gid);
        drawCtx.drawImage(image, renderData.left, renderData.top, renderData.width, renderData.height, xDest, yDest, renderData.width, renderData.height);
    }
    renderTileToCSSBackgroundImage(gid) {
        var renderData = this.getTileRenderData(gid);
        return (this.cssUrl + " " + -renderData.left + "px " + -renderData.top + "px");
    }
    get cssUrl() {
        return "url(" + this.imageSource + ")";
    }
    get imageUrl() {
        return this.imageSource;
    }
}
exports.TMXTileSet = TMXTileSet;
//# sourceMappingURL=TMXTileSet.js.map