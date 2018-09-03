import { TMXTileSet } from "../src/TMXTileSet";
import { TMXMarkupFragments } from "./CommonMarkup";

const parser = new DOMParser();

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

  it("Verify that we throw on an unknown child type.", () => {
    const tileSetNode = parser.parseFromString(
      TMXMarkupFragments.validTileSetMarkup +
        "<unknown_child_node_type /></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });

  it("Verify that we throw on an unknown child type for <tile> element.", () => {
    const tileSetNode = parser.parseFromString(
      TMXMarkupFragments.validTileSetMarkup +
        TMXMarkupFragments.validTileMarkup +
        "<unknown_child_node_type /></tile></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });

  it("Verify that we throw on an unsupported child type for <tile> element.", () => {
    const tileSetNode = parser.parseFromString(
      TMXMarkupFragments.validTileSetMarkup +
        TMXMarkupFragments.validTileMarkup +
        "<image /></tile></tileset>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });

  it("Verify that we throw if more than one <properties> is specified.", () => {
    const tileSetNode = parser.parseFromString(
      `${TMXMarkupFragments.validTileSetMarkup}${TMXMarkupFragments.validPropertiesMarkup}`,
      "text/xml"
    ).documentElement;

    expect(() => {
      const tmxTileSet = new TMXTileSet(null);
      tmxTileSet.import(tileSetNode);
    }).toThrow();
  });
});
