export class TMXTile {
  public tileId: number;
  public cellX: number;
  public cellY: number;
  
  constructor(gid: number, cellX: number, cellY: number) {
    this.tileId = gid;
    this.cellX = cellX;
    this.cellY = cellY;
  }
}
