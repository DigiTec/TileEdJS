import { TMXMap } from "./TMXMap";
export declare class TMXObjectGroup {
    private map;
    private groupProperties?;
    private objects;
    private objectNameMap;
    private objectTypeMap;
    private debugName;
    private deprecatedTileX;
    private deprecatedTileY;
    private deprecatedTileWidth;
    private deprecatedTileHeight;
    private opacity;
    private visible;
    private offsetX;
    private offsetY;
    private drawOrder;
    constructor(tmxMap: TMXMap);
    import(objectGroupNode: Element): void;
    private parseAttributes;
    readonly name: string;
}
//# sourceMappingURL=TMXObjectGroup.d.ts.map