"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TMXMap_1 = require("./TMXMap");
class TMXImporter {
    constructor(urlMapper) {
        this.tileSourceMapCallback = urlMapper;
    }
    loadFromUrl(url, callback) {
        const request = new XMLHttpRequest();
        const callbackObject = {
            req: request,
            tmxImporter: this,
            callback: callback
        };
        request.open("GET", url, true);
        request.addEventListener("readystatechange", () => {
            const request = callbackObject.req;
            if (request.readyState !== 4) {
                return;
            }
            const mapObject = this.loadFromXMLHttpResponse(request);
            callbackObject.callback.call(this, mapObject);
        });
        request.send();
    }
    loadFromXMLHttpResponse(request) {
        if (request.readyState !== 4) {
            throw "Invalid readyState value for operation: readyState = " +
                request.readyState;
        }
        return this.loadFromString(request.responseText);
    }
    loadFromString(mapXml) {
        const parser = new DOMParser();
        return this.loadFromXmlDom(parser.parseFromString(mapXml, "text/xml"));
    }
    loadFromXmlDom(dom) {
        const map = new TMXMap_1.TMXMap(this);
        map.importMap(dom.documentElement);
        return map;
    }
    mapTileSetSourceToUrl(rawUrl) {
        if (this.tileSourceMapCallback) {
            return this.tileSourceMapCallback.call(this, rawUrl);
        }
        return rawUrl;
    }
}
exports.TMXImporter = TMXImporter;
//# sourceMappingURL=TMXImporter.js.map