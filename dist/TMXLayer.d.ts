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
    importLayer(layerNode: Element): void;
    importXMLLayer(dataNode: Element): void;
    importCSVLayer(dataNode: Element): void;
    importBase64Layer(dataNode: Element): void;
    readonly name: string | undefined;
}
//# sourceMappingURL=TMXLayer.d.ts.map