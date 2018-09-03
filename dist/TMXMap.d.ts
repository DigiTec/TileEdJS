import { TMXImageLayer } from "./TMXImageLayer";
import { TMXImporter } from "./TMXImporter";
import { TMXLayer } from "./TMXLayer";
import { TMXTileSet } from "./TMXTileSet";
import { TMXPropertyMap } from "./TMXPropertyMap";
import { TMXObjectGroup } from "./TMXObjectGroup";
import { TMXGroup } from "./TMXGroup";
declare type ValidMapLayers = TMXLayer | TMXObjectGroup | TMXImageLayer | TMXGroup;
export declare class TMXMap {
    private importer;
    tileSets: Array<TMXTileSet>;
    layers: Array<ValidMapLayers>;
    mapProperties?: TMXPropertyMap;
    version: string;
    tileEdVersion: string;
    orientation: string;
    renderOrder: string;
    cellsX: number;
    cellsY: number;
    tileHeight: number;
    tileWidth: number;
    constructor(tmxImporter: TMXImporter);
    importMap(mapNode: Element): void;
    private parseAttributes;
    mapTileSetSourceToUrl(rawUrl: string): string;
    getTileProperties(gid: number): TMXPropertyMap;
    renderTileToCanvas(gid: number, drawCtx: CanvasRenderingContext2D, image: HTMLImageElement, xDest: number, yDest: number): void;
    renderTileToCSSBackgroundImage(gid: number): string | undefined;
    readonly layerCount: number;
}
export {};
//# sourceMappingURL=TMXMap.d.ts.map