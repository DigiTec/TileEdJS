import { TMXMap } from "./TMXMap";
export declare class TMXGroup {
    private map;
    private debugName?;
    offsetX: number;
    offsetY: number;
    opacity: number;
    visible: boolean;
    constructor(tmxMap: TMXMap);
    import(groupNode: Element): void;
    private parseAttributes;
}
//# sourceMappingURL=TMXGroup.d.ts.map