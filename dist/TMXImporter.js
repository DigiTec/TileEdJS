"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TMXMap_1 = require("./TMXMap");
var TMXImporter = /** @class */ (function () {
    function TMXImporter(urlMapper) {
        this.tileSourceMapCallback = urlMapper;
    }
    TMXImporter.prototype.loadFromUrl = function (url, callback) {
        var _this = this;
        var request = new XMLHttpRequest();
        var callbackObject = {
            req: request,
            tmxImporter: this,
            callback: callback
        };
        request.open("GET", url, true);
        request.addEventListener("readystatechange", function () {
            var request = callbackObject.req;
            if (request.readyState !== 4) {
                return;
            }
            var mapObject = _this.loadFromXMLHttpResponse(request);
            callbackObject.callback.call(_this, mapObject);
        });
        request.send();
    };
    TMXImporter.prototype.loadFromXMLHttpResponse = function (request) {
        if (request.readyState !== 4) {
            throw "Invalid readyState value for operation: readyState = " +
                request.readyState;
        }
        return this.loadFromString(request.responseText);
    };
    TMXImporter.prototype.loadFromString = function (mapXml) {
        var parser = new DOMParser();
        var dom = parser.parseFromString(mapXml, "text/xml");
        var map = new TMXMap_1.TMXMap(this);
        map.importMap(dom.documentElement);
        return map;
    };
    TMXImporter.prototype.mapTileSetSourceToUrl = function (rawUrl) {
        if (this.tileSourceMapCallback) {
            return this.tileSourceMapCallback.call(this, rawUrl);
        }
        return rawUrl;
    };
    return TMXImporter;
}());
exports.TMXImporter = TMXImporter;
//# sourceMappingURL=TMXImporter.js.map