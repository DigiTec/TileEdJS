import { TMXImporter } from "./TMXImporter";
import { TMXPropertyMap } from "./TMXPropertyMap";
export declare class TMXMap {
    private importer;
    private _tileSets;
    private _layers;
    mapProperties?: TMXPropertyMap;
    cellsX: number;
    cellsY: number;
    tileHeight: number;
    tileWidth: number;
    constructor(tmxImporter: TMXImporter);
    importMap(mapNode: Element): void;
    private parseMapData;
    mapTileSetSourceToUrl(rawUrl: string): string;
    getTileProperties(gid: any): any;
    renderTileToCanvas(gid: number, drawCtx: CanvasRenderingContext2D, image: HTMLImageElement, xDest: number, yDest: number): void;
    renderTileToCSSBackgroundImage(gid: number): string | undefined;
    private isSupported;
    readonly layerCount: number;
}
//# sourceMappingURL=TMXMap.d.ts.map