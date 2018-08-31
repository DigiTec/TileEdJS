function TMXImporter() {}

Object.defineProperties(TMXImporter.prototype, {
  loadFromUrl: {
    value: function(url, callback) {
      var request = new XMLHttpRequest();
      var callbackObject = {
        req: request,
        tmxImporter: this,
        callback: callback
      };

      request.open("GET", url, true);
      request.addEventListener(
        "readystatechange",
        this.loadFromURLCallback.bind(callbackObject)
      );
      request.send(null);
    }
  },

  loadFromURLCallback: {
    value: function() {
      var request = this.req;
      if (request.readyState != 4) {
        return;
      }

      var mapObject = this.tmxImporter.loadFromXMLHttpResponse(request);
      this.callback.call(this.tmxImporter, mapObject);
    }
  },

  loadFromXMLHttpResponse: {
    value: function(request) {
      if (request.readyState != 4) {
        throw "Invalid readyState value for operation: readyState = " +
          request.readyState;
      }
      return this.loadFromString(request.responseText);
    }
  },

  loadFromString: {
    value: function(mapXml) {
      var parser = new DOMParser();
      var dom = parser.parseFromString(mapXml, "text/xml");
      var map = new TMXMap(this);
      map.importMap(dom.documentElement);
      return map;
    }
  },

  mapTileSetSourceToUrl: {
    value: function(rawUrl) {
      if (this.tileSourceMap) {
        return this.tileSourceMap.call(this, rawUrl);
      }
      return rawUrl;
    }
  },

  // Properties
  tileSourceMapCallback: {
    get: function() {
      return this.tileSourceMap;
    },
    set: function(callback) {
      this.tileSourceMap = callback;
    }
  }
});
