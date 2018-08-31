import { TMXMap } from "./TMXMap";
export declare class TMXObjectGroup {
    private map;
    private groupProperties?;
    private objects;
    private objectNameMap;
    private objectTypeMap;
    private debugName;
    private cellsX;
    private cellsY;
    constructor(tmxMap: TMXMap);
    importObjectGroup(objectGroupNode: HTMLElement): void;
    readonly name: string;
}
//# sourceMappingURL=TMXObjectGroup.d.ts.map