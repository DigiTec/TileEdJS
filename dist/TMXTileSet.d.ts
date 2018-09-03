import { TMXMap } from "./TMXMap";
import { TMXPropertyMap } from "./TMXPropertyMap";
export declare class TMXTileSet {
    private map;
    private debugName;
    private tileProperties;
    private firstGid;
    private lastGid;
    private tileWidth;
    private tileHeight;
    private imageSource;
    private imageWidth;
    private imageHeight;
    private cellColumns;
    private cellRows;
    constructor(tmxMap: TMXMap);
    import(tileSetNode: Element): void;
    containsTile(gid: number): boolean;
    getTileRenderData(gid: number): {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    getTileProperties(gid: number): TMXPropertyMap;
    renderTileToCanvas(gid: number, drawCtx: CanvasRenderingContext2D, image: HTMLImageElement, xDest: number, yDest: number): void;
    renderTileToCSSBackgroundImage(gid: number): string;
    readonly cssUrl: string;
    readonly imageUrl: string;
}
//# sourceMappingURL=TMXTileSet.d.ts.map