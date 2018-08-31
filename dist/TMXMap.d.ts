import { TileSourceMapCallback } from "./TileSourceMapCallback";
import { TMXImporter } from "./TMXImporter";
import { TMXPropertyMap } from "./TMXPropertyMap";
export declare class TMXMap {
    private importer;
    private _tileSets;
    private _layers;
    private tileSourceMapCallback?;
    mapProperties?: TMXPropertyMap;
    cellsX: number;
    cellsY: number;
    tileHeight: number;
    tileWidth: number;
    constructor(tmxImporter: TMXImporter, urlMapper?: TileSourceMapCallback);
    importMap(mapNode: HTMLElement): void;
    parseMapData(mapNode: HTMLElement): void;
    mapTileSetSourceToUrl(rawUrl: string): any;
    getTileProperties(gid: any): any;
    renderTileToCanvas(gid: number, drawCtx: CanvasRenderingContext2D, image: HTMLImageElement, xDest: number, yDest: number): void;
    renderTileToCSSBackgroundImage(gid: number): string | undefined;
    private isSupported;
    readonly layerCount: number;
}
//# sourceMappingURL=TMXMap.d.ts.map