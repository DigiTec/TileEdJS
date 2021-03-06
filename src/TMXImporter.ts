﻿import { TileSourceMapCallback } from "./TileSourceMapCallback";
import { TMXMap } from "./TMXMap";

export class TMXImporter {
  private tileSourceMapCallback?: TileSourceMapCallback;
  constructor(urlMapper?: TileSourceMapCallback) {
    this.tileSourceMapCallback = urlMapper;
  }

  loadFromUrl(url: string, callback: Function): void {
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

  loadFromXMLHttpResponse(request: XMLHttpRequest): TMXMap {
    if (request.readyState !== 4) {
      throw "Invalid readyState value for operation: readyState = " +
        request.readyState;
    }
    return this.loadFromString(request.responseText);
  }

  loadFromString(mapXml: string): TMXMap {
    const parser = new DOMParser();
    return this.loadFromXmlDom(parser.parseFromString(mapXml, "text/xml"));
  }

  loadFromXmlDom(dom: Document): TMXMap {
    const map = new TMXMap(this);
    map.importMap(dom.documentElement);
    return map;
  }

  mapTileSetSourceToUrl(rawUrl: string): string {
    if (this.tileSourceMapCallback) {
      return this.tileSourceMapCallback.call(this, rawUrl);
    }
    return rawUrl;
  }
}
