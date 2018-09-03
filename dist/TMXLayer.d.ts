import { TMXMap } from "./TMXMap";
export declare class TMXLayer {
    private map;
    private tiles;
    private debugName;
    private cellsX;
    private cellsY;
    private layerEncoding?;
    private layerProperties?;
    constructor(tmxMap: TMXMap);
    import(layerNode: Element): void;
    private parseAttributes;
    private importXMLLayer;
    private importCSVLayer;
    private importBase64Layer;
    readonly name: string;
}
//# sourceMappingURL=TMXLayer.d.ts.map