function TMXMap(importer) {
  this._importer = importer;
  this._tileSets = new Array();
  this._layers = new Array();
  this._tileSourceMap;
}

Object.defineProperties(TMXMap.prototype, {
  // Methods
  importMap: {
    value: function(mapNode) {
      if (this.isSupported(mapNode)) {
        this.parseMapData(mapNode);
        [].forEach.call(
          mapNode.childNodes,
          function(childNode) {
            if (childNode.nodeType == Node.ELEMENT_NODE) {
              switch (childNode.localName) {
                case "tileset":
                  var newTileSet = new TMXTileSet(this);
                  newTileSet.importTileSet(childNode);
                  this._tileSets.push(newTileSet);
                  break;
                case "layer":
                  var newLayer = new TMXLayer(this);
                  newLayer.importLayer(childNode);
                  this._layers.push(newLayer);
                  break;
                case "objectgroup":
                  var newObjectGroup = new TMXObjectGroup(this);
                  newObjectGroup.importObjectGroup(childNode);
                  this._layers.push(newObjectGroup);
                  break;
                case "properties":
                  if (this._mapProperties) {
                    throw "Duplicate properties definition for map";
                  }
                  this._mapProperties = new TMXPropertyMap(this);
                  this._mapProperties.importProperties(childNode);
                  break;
              }
            }
          },
          this
        );
      } else {
        throw "Unsupported mapElement. Check version and orienation.";
      }
    }
  },

  parseMapData: {
    value: function(mapNode) {
      this.cellsX = parseInt(
        mapNode.attributes.getNamedItem("width").nodeValue
      );
      this.cellsY = parseInt(
        mapNode.attributes.getNamedItem("height").nodeValue
      );
      this.tileWidth = parseInt(
        mapNode.attributes.getNamedItem("tilewidth").nodeValue
      );
      this.tileHeight = parseInt(
        mapNode.attributes.getNamedItem("tileheight").nodeValue
      );
    }
  },

  mapTileSetSourceToUrl: {
    value: function(rawUrl) {
      if (this.tileSourceMap) {
        return this.tileSourceMap.call(this, rawUrl);
      } else if (this._importer) {
        return this._importer.mapTileSetSourceToUrl(rawUrl);
      }
      return rawUrl;
    }
  },

  getTileProperties: {
    value: function(gid) {
      for (var i = 0; i < this._tileSets.length; i++) {
        if (this._tileSets[i].containsTile(gid)) {
          return this._tileSets[i].getTileProperties(gid);
        }
      }
    }
  },

  renderTileToCanvas: {
    value: function(gid, drawCtx, image, xDest, yDest) {
      for (var i = 0; i < this._tileSets.length; i++) {
        if (this._tileSets[i].containsTile(gid)) {
          var renderData = this._tileSets[i].getTileRenderData(gid);
          if (renderData) {
            drawCtx.drawImage(
              image,
              renderData.left,
              renderData.top,
              renderData.width,
              renderData.height,
              xDest,
              yDest,
              renderData.width,
              renderData.height
            );
          }
          break;
        }
      }
    }
  },

  renderTileToCSSBackgroundImage: {
    value: function(gid) {
      for (var i = 0; i < this._tileSets.length; i++) {
        if (this._tileSets[i].containsTile(gid)) {
          var renderData = this._tileSets[i].getTileRenderData(gid);
          if (renderData) {
            return (
              this._tileSets[i].cssUrl +
              " " +
              -renderData.left +
              "px " +
              -renderData.top +
              "px"
            );
          }
          break;
        }
      }
      return undefined;
    }
  },

  // Properties
  isSupported: {
    value: function(mapNode) {
      return (
        mapNode.attributes.getNamedItem("version").nodeValue == "1.0" &&
        mapNode.attributes.getNamedItem("orientation").nodeValue == "orthogonal"
      );
    }
  },

  tileSourceMapCallback: {
    get: function() {
      return this.tileSourceMap;
    },
    set: function(callback) {
      this.tileSourceMap = callback;
    }
  },

  layerCount: {
    get: function() {
      return this._layers.length;
    }
  }
});
