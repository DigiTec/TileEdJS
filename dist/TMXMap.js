"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XmlParserHelpers_1 = require("./XmlParserHelpers");
var TMXMap = /** @class */ (function () {
    function TMXMap(tmxImporter, urlMapper) {
        this._tileSets = [];
        this._layers = [];
        this.cellsX = 0;
        this.cellsY = 0;
        this.tileHeight = 0;
        this.tileWidth = 0;
        this.importer = tmxImporter;
        this.tileSourceMapCallback = urlMapper;
    }
    TMXMap.prototype.importMap = function (mapNode) {
        if (this.isSupported(mapNode)) {
            this.parseMapData(mapNode);
            for (var i = 0; i < mapNode.childNodes.length; i++) {
                var childNode = mapNode.childNodes[i];
                if (childNode.nodeType == Node.ELEMENT_NODE) {
                    switch (childNode.localName) {
                        case "tileset":
                            var newTileSet = new window.TMXTileSet(this);
                            newTileSet.importTileSet(childNode);
                            this._tileSets.push(newTileSet);
                            break;
                        case "layer":
                            var newLayer = new window.TMXLayer(this);
                            newLayer.importLayer(childNode);
                            this._layers.push(newLayer);
                            break;
                        case "objectgroup":
                            var newObjectGroup = new window.TMXObjectGroup(this);
                            newObjectGroup.importObjectGroup(childNode);
                            this._layers.push(newObjectGroup);
                            break;
                        case "properties":
                            if (this._mapProperties) {
                                throw "Duplicate properties definition for map";
                            }
                            this._mapProperties = new window.TMXPropertyMap(this);
                            this._mapProperties.importProperties(childNode);
                            break;
                    }
                }
            }
        }
        else {
            throw "Unsupported mapElement. Check version and orienation.";
        }
    };
    TMXMap.prototype.parseMapData = function (mapNode) {
        this.cellsX = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "width"));
        this.cellsY = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "height"));
        this.tileWidth = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tilewidth"));
        this.tileHeight = parseInt(XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "tileheight"));
    };
    TMXMap.prototype.mapTileSetSourceToUrl = function (rawUrl) {
        if (this.tileSourceMapCallback) {
            return this.tileSourceMapCallback.call(this, rawUrl);
        }
        else if (this.importer) {
            return this.importer.mapTileSetSourceToUrl(rawUrl);
        }
        return rawUrl;
    };
    TMXMap.prototype.getTileProperties = function (gid) {
        for (var i = 0; i < this._tileSets.length; i++) {
            if (this._tileSets[i].containsTile(gid)) {
                return this._tileSets[i].getTileProperties(gid);
            }
        }
    };
    TMXMap.prototype.renderTileToCanvas = function (gid, drawCtx, image, xDest, yDest) {
        for (var i = 0; i < this._tileSets.length; i++) {
            if (this._tileSets[i].containsTile(gid)) {
                var renderData = this._tileSets[i].getTileRenderData(gid);
                if (renderData) {
                    drawCtx.drawImage(image, renderData.left, renderData.top, renderData.width, renderData.height, xDest, yDest, renderData.width, renderData.height);
                }
                break;
            }
        }
    };
    TMXMap.prototype.renderTileToCSSBackgroundImage = function (gid) {
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
    };
    TMXMap.prototype.isSupported = function (mapNode) {
        return (XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "version") === "1.0" &&
            XmlParserHelpers_1.XmlParserHelpers.safeNodeValue(mapNode, "orientation") === "orthogonal");
    };
    Object.defineProperty(TMXMap.prototype, "layerCount", {
        get: function () {
            return this._layers.length;
        },
        enumerable: true,
        configurable: true
    });
    return TMXMap;
}());
exports.TMXMap = TMXMap;
//# sourceMappingURL=TMXMap.js.map