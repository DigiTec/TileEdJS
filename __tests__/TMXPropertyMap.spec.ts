import { TMXPropertyMap } from "../src/TMXPropertyMap";
import { TMXMarkupFragments } from "./CommonMarkup";

const parser = new DOMParser();

describe("Invalid Tile Sets", () => {
  it("Verify that an invalid child node type will throw.", () => {
    const propertyMapNode = parser.parseFromString(
      TMXMarkupFragments.validPropertiesMarkup +
        "<unknown_child_node /></properties>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxPropertyMap = new TMXPropertyMap();
      tmxPropertyMap.import(propertyMapNode);
    }).toThrow();
  });

  it("Verify that valid properties parse.", () => {
    const propertyMapNode = parser.parseFromString(
      TMXMarkupFragments.validPropertiesMarkup +
        TMXMarkupFragments.validPropertyMarkup +
        "</properties>",
      "text/xml"
    ).documentElement;

    const tmxPropertyMap = new TMXPropertyMap();
    tmxPropertyMap.import(propertyMapNode);
    expect(tmxPropertyMap.hasOwnProperty("valid")).toBeTruthy();
  });
});
