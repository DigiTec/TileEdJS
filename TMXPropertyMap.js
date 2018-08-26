function TMXPropertyMap() {
}

Object.defineProperties(TMXPropertyMap.prototype, {
  // Methods
  importProperties: {
    value: function (propertiesNode) {
      [].forEach.call(propertiesNode.childNodes, function (childNode) {
        if (childNode.nodeType == Node.ELEMENT_NODE) {
          switch (childNode.localName) {
            case "property":
              Object.defineProperty(this, childNode.attributes.getNamedItem("name").nodeValue,
                {
                  value: childNode.attributes.getNamedItem("value").nodeValue,
                  configurable: false,
                  writable: true,
                  enumerable: true
                });
              break;
            default:
              throw "Unsupported node in property map: localName = " + childNode.localName;
              break;
          }
        }
      }, this);
    },
    configurable: false,
    writable: false,
    enumerable: true
  }
});
