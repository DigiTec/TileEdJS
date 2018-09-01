import { TMXMap } from "./TMXMap";
export declare class TMXLayer {
    private map;
    private tiles;
    private debugName?;
    private cellsX;
    private cellsY;
    private layerEncoding?;
    private layerProperties?;
    constructor(tmxMap: TMXMap);
    importLayer(layerNode: HTMLElement): void;
    importXMLLayer(dataNode: HTMLElement): void;
    importCSVLayer(dataNode: HTMLElement): void;
    importBase64Layer(dataNode: HTMLElement): void;
    readonly name: string | undefined;
}
//# sourceMappingURL=TMXLayer.d.ts.map