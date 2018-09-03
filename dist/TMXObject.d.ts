import { TMXMap } from "./TMXMap";
export declare class TMXObject {
    private map;
    private uniqueId;
    private debugName;
    private tileId;
    private absoluteX;
    private absoluteY;
    private absoluteWidth;
    private absoluteHeight;
    private objectProperties?;
    objectType: string;
    constructor(tmxMap: TMXMap);
    import(objectNode: Element): void;
    private parseAttributes;
    readonly name: string;
    readonly isTileObject: boolean;
}
//# sourceMappingURL=TMXObject.d.ts.map