function TMXObject(map) {
  this._map = map;
}

Object.defineProperties(TMXObject.prototype, {
  // Methods
  importObject: {
    value: function (objectNode) {
      this._debugName = objectNode.attributes.getNamedItem("name").nodeValue;
      this.objectType = objectNode.attributes.getNamedItem("type").nodeValue;

      // Objects are either lose and have odd shapes not aligned to cells or they 
      // have tileId's and would have cell based properties. For now, import absolute
      // coordinates.
      this.absoluteX = parseInt(objectNode.attributes.getNamedItem("x").nodeValue);
      this.absoluteY = parseInt(objectNode.attributes.getNamedItem("y").nodeValue);

      if (objectNode.hasAttribute("width")) {
        this.absoluteWidth = parseInt(objectNode.attributes.getNamedItem("width").nodeValue);
      }
      if (objectNode.hasAttribute("height")) {
        this.absoluteHeight = parseInt(objectNode.attributes.getNamedItem("height").nodeValue);
      }
      if (objectNode.hasAttribute("gid")) {
        this.tileId = parseInt(objectNode.attributes.getNamedItem("gid").nodeValue);
      }

      [].forEach.call(objectNode.childNodes, function (childNode) {
        if (childNode.nodeType == Node.ELEMENT_NODE) {
          switch (childNode.localName) {
            case "properties":
              if (this._objectProperties) {
                throw "Duplicate properties definition for object " + this._debugName;
              }
              this._objectProperties = new TMXPropertyMap(this);
              this._objectProperties.importProperties(childNode);
              break;

            default:
              throw "Unsupported node in object: localName = " + childNode.localName;
              break;
          }
        }
      }, this);
    },
  },

  // Properties
  name:
  {
    get: function () {
      return this._debugName;
    },
    configurable: false,
    enumerable: true
  },
  isTileObject:
  {
    get: function () {
      if (this.tileId) {
        return true;
      }
      else {
        return false;
      }
    }
  },
});