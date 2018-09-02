import { TMXMap } from "./TMXMap";
export declare class TMXImageLayer {
    private map;
    private debugName?;
    offsetX: number;
    offsetY: number;
    opacity: number;
    visible: boolean;
    constructor(tmxMap: TMXMap);
    import(imageLayerNode: Element): void;
    private parseAttributes;
}
//# sourceMappingURL=TMXImageLayer.d.ts.map