"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMXImageLayer_1 = require("./TMXImageLayer");
const TMXLayer_1 = require("./TMXLayer");
const XmlParserHelpers_1 = require("./XmlParserHelpers");
const TMXTileSet_1 = require("./TMXTileSet");
const TMXPropertyMap_1 = require("./TMXPropertyMap");
const TMXObjectGroup_1 = require("./TMXObjectGroup");
class TMXMap {
    constructor(tmxImporter) {
        this.tileSets = new Array();
        this.layers = new Array();
        // Direct attributes from the <map> node.
        this.version = "";
        this.tileEdVersion = "";
        this.orientation = "";
        this.renderOrder = "";
        this.cellsX = -1;
        this.cellsY = -1;
        this.tileHeight = -1;
        this.tileWidth = -1;
        this.importer = tmxImporter;
    }
    importMap(mapNode) {
        this.parseMapData(mapNode);
        for (let i = 0; i < mapNode.childNodes.length; i++) {
            const childNode = mapNode.childNodes[i];
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                switch (childNode.localName) {
                    case "properties":
                        if (this.mapProperties) {
                            throw "Duplicate properties definition for map";
                        }
                        this.mapProperties = new TMXPropertyMap_1.TMXPropertyMap();
                        this.mapProperties.import(childNode);
                        break;
                    case "tileset":
                        const newTileSet = new TMXTileSet_1.TMXTileSet(this);
                        newTileSet.importTileSet(childNode);
                        this.tileSets.push(newTileSet);
                        break;
                    case "layer":
                        const newLayer = new TMXLayer_1.TMXLayer(this);
                        newLayer.importLayer(childNode);
                        this.layers.push(newLayer);
                        break;
                    case "objectgroup":
                        const newObjectGroup = new TMXObjectGroup_1.TMXObjectGroup(this);
                        newObjectGroup.importObjectGroup(childNode);
                        this.layers.push(newObjectGroup);
                        break;
                    case "imagelayer":
                        const newImageLayer = new TMXImageLayer_1.TMXImageLayer(this);
                        newImageLayer.import(childNode);
                        this.layers.push(newImageLayer);
                        break;
                    case "group":
                        break;
                    default:
                        throw "Unsupported child node type in map " + childNode.localName;
                }
            }
        }
    }
    parseMapData(mapNode) {
        this.version = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "version");
        this.tileEdVersion = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tiledversion");
        this.orientation = XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "orientation");
        this.renderOrder =
            XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "renderorder") || "right-down";
        this.cellsX = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "width"));
        this.cellsY = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "height"));
        this.tileWidth = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tilewidth"));
        this.tileHeight = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tileheight"));
        if (this.version !== "1.0" || this.orientation != "orthogonal") {
            throw "Unsupported mapElement. Check version and orienation.";
        }
    }
    mapTileSetSourceToUrl(rawUrl) {
        return this.importer.mapTileSetSourceToUrl(rawUrl);
    }
    getTileProperties(gid) {
        for (var i = 0; i < this.tileSets.length; i++) {
            if (this.tileSets[i].containsTile(gid)) {
                return this.tileSets[i].getTileProperties(gid);
            }
        }
        throw "Tile " + gid + " not found in any of the existing tile sets.";
    }
    renderTileToCanvas(gid, drawCtx, image, xDest, yDest) {
        for (var i = 0; i < this.tileSets.length; i++) {
            if (this.tileSets[i].containsTile(gid)) {
                var renderData = this.tileSets[i].getTileRenderData(gid);
                if (renderData) {
                    drawCtx.drawImage(image, renderData.left, renderData.top, renderData.width, renderData.height, xDest, yDest, renderData.width, renderData.height);
                }
                break;
            }
        }
    }
    renderTileToCSSBackgroundImage(gid) {
        for (var i = 0; i < this.tileSets.length; i++) {
            if (this.tileSets[i].containsTile(gid)) {
                var renderData = this.tileSets[i].getTileRenderData(gid);
                if (renderData) {
                    return (this.tileSets[i].cssUrl +
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
        return this.layers.length;
    }
}
exports.TMXMap = TMXMap;
//# sourceMappingURL=TMXMap.js.map