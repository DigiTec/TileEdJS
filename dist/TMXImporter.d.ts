import { TileSourceMapCallback } from "./TileSourceMapCallback";
import { TMXMap } from "./TMXMap";
export declare class TMXImporter {
    private tileSourceMapCallback?;
    constructor(urlMapper?: TileSourceMapCallback);
    loadFromUrl(url: string, callback: Function): void;
    loadFromXMLHttpResponse(request: XMLHttpRequest): TMXMap;
    loadFromString(mapXml: string): TMXMap;
    mapTileSetSourceToUrl(rawUrl: string): string;
}
//# sourceMappingURL=TMXImporter.d.ts.map