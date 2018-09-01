"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XmlParserHelpers_1 = require("./XmlParserHelpers");
const TMXTileSet_1 = require("./TMXTileSet");
const TMXPropertyMap_1 = require("./TMXPropertyMap");
const TMXObjectGroup_1 = require("./TMXObjectGroup");
class TMXMap {
    constructor(tmxImporter) {
        this._tileSets = [];
        this._layers = [];
        this.cellsX = 0;
        this.cellsY = 0;
        this.tileHeight = 0;
        this.tileWidth = 0;
        this.importer = tmxImporter;
    }
    importMap(mapNode) {
        if (this.isSupported(mapNode)) {
            this.parseMapData(mapNode);
            for (let i = 0; i < mapNode.childNodes.length; i++) {
                const childNode = mapNode.childNodes[i];
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    switch (childNode.localName) {
                        case "tileset":
                            const newTileSet = new TMXTileSet_1.TMXTileSet(this);
                            newTileSet.importTileSet(childNode);
                            this._tileSets.push(newTileSet);
                            break;
                        case "layer":
                            const newLayer = new window.TMXLayer(this);
                            newLayer.importLayer(childNode);
                            this._layers.push(newLayer);
                            break;
                        case "objectgroup":
                            const newObjectGroup = new TMXObjectGroup_1.TMXObjectGroup(this);
                            newObjectGroup.importObjectGroup(childNode);
                            this._layers.push(newObjectGroup);
                            break;
                        case "properties":
                            if (this.mapProperties) {
                                throw "Duplicate properties definition for map";
                            }
                            this.mapProperties = new TMXPropertyMap_1.TMXPropertyMap();
                            this.mapProperties.importProperties(childNode);
                            break;
                    }
                }
            }
        }
        else {
            throw "Unsupported mapElement. Check version and orienation.";
        }
    }
    parseMapData(mapNode) {
        this.cellsX = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "width"));
        this.cellsY = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "height"));
        this.tileWidth = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tilewidth"));
        this.tileHeight = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tileheight"));
    }
    mapTileSetSourceToUrl(rawUrl) {
        return this.importer.mapTileSetSourceToUrl(rawUrl);
    }
    getTileProperties(gid) {
        for (var i = 0; i < this._tileSets.length; i++) {
            if (this._tileSets[i].containsTile(gid)) {
                return this._tileSets[i].getTileProperties(gid);
            }
        }
    }
    renderTileToCanvas(gid, drawCtx, image, xDest, yDest) {
        for (var i = 0; i < this._tileSets.length; i++) {
            if (this._tileSets[i].containsTile(gid)) {
                var renderData = this._tileSets[i].getTileRenderData(gid);
                if (renderData) {
                    drawCtx.drawImage(image, renderData.left, renderData.top, renderData.width, renderData.height, xDest, yDest, renderData.width, renderData.height);
                }
                break;
            }
        }
    }
    renderTileToCSSBackgroundImage(gid) {
        for (var i = 0; i < this._tileSets.length; i++) {
            if (this._tileSets[i].containsTile(gid)) {
                var renderData = this._tileSets[i].getTileRenderData(gid);
                if (renderData) {
                    return (this._tileSets[i].cssUrl +
                        " " +
                        -renderData.left +
                        "px " +
                        -renderData.top +
                        "px");
                }
                break;
            }
        }
        return undefined;
    }
    isSupported(mapNode) {
        return (XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "version") === "1.0" &&
            XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "orientation") === "orthogonal");
    }
    get layerCount() {
        return this._layers.length;
    }
}
exports.TMXMap = TMXMap;
//# sourceMappingURL=TMXMap.js.map