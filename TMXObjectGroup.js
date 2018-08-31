function TMXObjectGroup(tmxMap) {
  this._map = tmxMap;
  this._objects = new Array();
  this._objectNameMap = new Object();
  this._objectTypeMap = new Object();
}

Object.defineProperties(TMXObjectGroup.prototype, {
  // Methods
  importObjectGroup: {
    value: function(objectGroupNode) {
      this._debugName = objectGroupNode.attributes.getNamedItem(
        "name"
      ).nodeValue;
      this.cellsX = parseInt(
        objectGroupNode.attributes.getNamedItem("width").nodeValue
      );
      this.cellsY = parseInt(
        objectGroupNode.attributes.getNamedItem("height").nodeValue
      );

      [].forEach.call(
        objectGroupNode.childNodes,
        function(childNode) {
          if (childNode.nodeType == Node.ELEMENT_NODE) {
            switch (childNode.localName) {
              case "properties":
                if (this._groupProperties) {
                  throw "Duplicate properties definition for object group layer " +
                    this._debugName;
                }
                this._groupProperties = new TMXPropertyMap(this);
                this._groupProperties.importProperties(childNode);
                break;

              case "object":
                var newObject = new TMXObject(this._map);
                newObject.importObject(childNode);

                this._objects.push(newObject);
                this._objectNameMap[newObject.name] = newObject;

                if (!this._objectTypeMap[newObject.objectType]) {
                  this._objectTypeMap[newObject.objectType] = [];
                }
                this._objectTypeMap[newObject.objectType].push(newObject);
                break;

              default:
                throw "Unsupported node in object group layer: localName = " +
                  childNode.localName;
                break;
            }
          }
        },
        this
      );
    }
  },

  // Properties
  name: {
    get: function() {
      return this._debugName;
    },
    configurable: false,
    enumerable: true
  }
});
