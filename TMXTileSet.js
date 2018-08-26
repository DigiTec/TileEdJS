function TMXTileSet(tmxMap) {
  this._map = tmxMap;
  this._tileProperties = new Array();
}

Object.defineProperties(TMXTileSet.prototype, {
  // Methods
  importTileSet: {
    value: function (tileSetNode) {
      if (tileSetNode.hasAttribute("source")) {
        throw "TSX files such as " + tileSetNode.attributes.getNamedItem("source").nodeValue + " are not supported";
      }

      var localAttributes = tileSetNode.attributes;
      this._firstGid = parseInt(localAttributes.getNamedItem("firstgid").nodeValue);
      this._debugName = localAttributes.getNamedItem("name").nodeValue;
      this._tileWidth = parseInt(localAttributes.getNamedItem("tilewidth").nodeValue);
      this._tileHeight = parseInt(localAttributes.getNamedItem("tileheight").nodeValue);

      [].forEach.call(tileSetNode.childNodes, function (childNode) {
        if (childNode.nodeType == Node.ELEMENT_NODE) {
          switch (childNode.localName) {
            case "image":
              this._imageSource = this._map.mapTileSetSourceToUrl(childNode.attributes.getNamedItem("source").nodeValue);
              this._imageWidth = parseInt(childNode.attributes.getNamedItem("width").nodeValue);
              this._imageHeight = parseInt(childNode.attributes.getNamedItem("height").nodeValue);
              this._cellColumns = this._imageWidth / this._tileWidth;
              this._cellRows = this._imageHeight / this._tileHeight;
              this._lastGid = this._firstGid + this._cellColumns * this._cellRows - 1;
              break;

            case "tile":
              var localId = parseInt(childNode.attributes.getNamedItem("id").nodeValue);
              [].forEach.call(childNode.childNodes, function (childNode) {
                if (childNode.nodeType == Node.ELEMENT_NODE) {
                  switch (childNode.localName) {
                    case "properties":
                      this._tileProperties[localId] = new TMXPropertyMap(this);
                      this._tileProperties[localId].importProperties(childNode);
                      break;

                    default:
                      throw "Unsupported child node for tile properties in TMXTileSet: localName = " + childNode.localName;
                  }
                }
              }, this);
              break;

            default:
              throw "Unsupported child node in TMXTileSet: localName = " + childNode.localName;
          }
        }
      }, this);
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  containsTile:
  {
    value: function (gid) {
      return (gid >= this._firstGid && gid <= this._lastGid);
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  getTileRenderData:
  {
    value: function (gid) {
      var offsetGid = gid - this._firstGid;
      var xCell = offsetGid % this._cellColumns;
      var yCell = parseInt(offsetGid / this._cellColumns);

      if (yCell < this._cellRows) {
        return {
          left: (xCell * this._tileWidth),
          top: (yCell * this._tileHeight),
          width: this._tileWidth,
          height: this._tileHeight
        };
      }
      else {
        throw "Tile out of range";
      }
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  getTileProperties:
  {
    value: function (gid) {
      var localId = gid - this._firstGid;
      return this._tileProperties[localId];
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  renderTileToCanvas:
  {
    value: function (gid, drawCtx, image, xDest, yDest) {
      var renderData = this.getTileRenderData(gid);
      if (renderData) {
        drawCtx.drawImage(image, renderData.left, renderData.top, renderData.width, renderData.height, xDest, yDest, renderData.width, renderData.height);
      }
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  renderTileToCSSBackgroundImage:
  {
    value: function (gid) {
      var renderData = this.getTileRenderData(gid);
      if (renderData) {
        return cssUrl + " " + (-renderData.left) + "px " + (-renderData.top) + "px";
      }
      return undefined;
    },
    configurable: false,
    writable: false,
    enumerable: true
  },

  // Properties
  cssUrl:
  {
    get: function () {
      return "url(" + this._imageSource + ")";
    },
    configurable: false,
    enumerable: true
  },
  imageUrl:
  {
    get: function () {
      return this._imageSource;
    },
    configurable: false,
    enumerable: true
  }
});