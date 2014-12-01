function TMXTile(gid, cellX, cellY)
{
    this.tileId = gid;
    this.cellX = cellX;
    this.cellY = cellY;
}

function TMXLayer(tmxMap)
{
    this._map = tmxMap;
    this._tiles = new Array();
}

Object.defineProperties(TMXLayer,
{
    // Constants
    LAYERENCODING_XML:
    {
        value: 0x0,
        configurable: false,
        writable: false,
        enumerable: true
    },
    LAYERENCODING_CSV:
    {
        value: 0x1,
        configurable: false,
        writable: false,
        enumerable: true
    },
    LAYERENCODING_BASE64:
    {
        value: 0x2,
        configurable: false,
        writable: false,
        enumerable: true
    }
});

Object.defineProperties(TMXLayer.prototype,
{
    // Methods
    importLayer:
    {
        value: function (layerNode)
        {
            this._debugName = layerNode.attributes.getNamedItem("name").nodeValue;
            this.cellsX = parseInt(layerNode.attributes.getNamedItem("width").nodeValue);
            this.cellsY = parseInt(layerNode.attributes.getNamedItem("height").nodeValue);

            [].forEach.call(layerNode.childNodes, function (childNode)
            {
                if (childNode.nodeType == Node.ELEMENT_NODE)
                {
                    switch (childNode.localName)
                    {
                        case "data":
                            this.layerEncoding = TMXLayer.LAYERENCODING_XML;
                            if (childNode.hasAttribute("compression"))
                            {
                                throw "Compression is not supported at this time for compression type " + childNode.attributes.getNamedItem("compression").nodeValue;
                            }
                            if (childNode.hasAttribute("encoding"))
                            {
                                switch(childNode.attributes.getNamedItem("encoding").nodeValue)
                                {
                                    case "csv":
                                        this.layerEncoding = TMXLayer.LAYERENCODING_CSV;
                                        break;
                                    case "base64":
                                        this.layerEncoding = TMXLayer.LAYERENCODING_BASE64;
                                        break;
                                    default:
                                        throw "Unsupported encoding type " + childNode.attributes.getNamedItem("encoding").nodeValue;
                                }
                            }
                            switch(this.layerEncoding)
                            {
                                case TMXLayer.LAYERENCODING_XML:
                                    this.importXMLLayer(childNode);
                                    break;
                                case TMXLayer.LAYERENCODING_CSV:
                                    this.importCSVLayer(childNode);
                                    break;
                                case TMXLayer.LAYERENCODING_BASE64:
                                    this.importBase64Layer(childNode);
                                    break;
                            }
                            break;

                        case "properties":
                            if (this._layerProperties)
                            {
                                throw "Duplicate properties definition for layer " + this._debugName;
                            }
                            this._layerProperties = new TMXPropertyMap(this);
                            this._layerProperties.importProperties(childNode);
                            break;

                        default:
                            throw "Unsupported node in layer: localName = " + childNode.localName;
                            break;
                    }
                }
            }, this);
        }
    },
    importXMLLayer:
    {
        value: function(dataNode)
        {
            var cellX = 0;
            var cellY = 0;

            [].forEach.call(dataNode.childNodes, function (tileNode)
            {
                if (tileNode.nodeType == Node.ELEMENT_NODE)
                {
                    switch (tileNode.localName)
                    {
                        case "tile":
                            var newTile = new TMXTile(
                                parseInt(tileNode.attributes.getNamedItem("gid").nodeValue),
                                cellX++, cellY);
                            this._tiles.push(newTile);
                            break;
                        default:
                            throw "Unsupported node in layer data block: localName = " + childNode.localName;
                            break;
                    }
                    if (cellX == this.cellsX)
                    {
                        cellX = 0;
                        cellY++;
                    }
                }
            }, this);
        }
    },
    importCSVLayer:
    {
        value: function(dataNode)
        {
            var cellX = 0;
            var cellY = 0;

            [].forEach.call(dataNode.childNodes, function (tileNode)
            {
                if (tileNode.nodeType == Node.TEXT_NODE)
                {
                    var tileIds = tileNode.nodeValue.split(",");
                    tileIds.forEach(function(tileIdString)
                    {
                        var newTile = new TMXTile(parseInt(tileIdString), cellX++, cellY);
                        this._tiles.push(newTile);
                        if (cellX == this.cellsX)
                        {
                            cellX = 0;
                            cellY++;
                        }
                    }, this);
                }
            }, this);
        }
    },
    importBase64Layer:
    {
        value: function(dataNode)
        {
            var cellX = 0;
            var cellY = 0;

            [].forEach.call(dataNode.childNodes, function (tileNode)
            {
                if (tileNode.nodeType == Node.TEXT_NODE)
                {
                    var bytes = Base64.decode(tileNode.nodeValue);
                    for(var i = 0; i < bytes.length; i += 4)
                    {
                        var tileId = 
                            bytes.charCodeAt(i) +
                            (bytes.charCodeAt(i+1) << 8) +
                            (bytes.charCodeAt(i+2) << 16) +
                            (bytes.charCodeAt(i+3) << 24);

                        var newTile = new TMXTile(tileId, cellX++, cellY);
                        this._tiles.push(newTile);
                        if (cellX == this.cellsX)
                        {
                            cellX = 0;
                            cellY++;
                        }
                    }
                }
            }, this);
        }
    },

    // Properties
    name:
    {
        get: function()
        {
            return this._debugName;
        },
        configurable: false,
        enumerable: true
    },
});

function Base64()
{
}

Object.defineProperties(Base64,
{
    // Constants
    KEYCHARS:
    {
        value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        configurable: false,
        writable: false,
        enumerable: true
    },

    // "static" methods
    decode: 
    {
        value: function(input)
        {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
 
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length)
            {
                enc1 = Base64.KEYCHARS.indexOf(input.charAt(i++));
                enc2 = Base64.KEYCHARS.indexOf(input.charAt(i++));
                enc3 = Base64.KEYCHARS.indexOf(input.charAt(i++));
                enc4 = Base64.KEYCHARS.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64)
                {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64)
                {
                    output = output + String.fromCharCode(chr3);
                }
            }
            return output;
        },
        configurable: false,
        writable: false,
        enumerable: true
    }
});