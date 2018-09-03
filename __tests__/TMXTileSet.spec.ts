import { TMXTileSet } from "../src/TMXTileSet";

const parser = new DOMParser();
const validTileSetMarkup =
  "<tileset firstgid='1' name='foo' tilewidth='16' tileheight='16'>";
const validTileMarkup = "<tile id='1'>";

describe("Invalid Tile Sets", () => {
  it("Verify that we don't support the 'source' attribute.", () => {
    const tileSetNode = parser.parseFromString(
      "<tileset source='foo'></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });

  it("Verify that we throw on an unsupported child type.", () => {
    const tileSetNode = parser.parseFromString(
      validTileSetMarkup + "<unknown_child_node_type /></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });

  it("Verify that we throw on an unsupported child type for <tile> element.", () => {
    const tileSetNode = parser.parseFromString(
      validTileSetMarkup +
        validTileMarkup +
        "<unknown_child_node_type /></tile></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });
});
