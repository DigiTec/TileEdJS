import { TMXPropertyMap } from "../src/TMXPropertyMap";

const parser = new DOMParser();
const validPropertiesMarkup = "<properties>";
const validPropertyMarkup = "<property name='valid' value='property'>";

describe("Invalid Tile Sets", () => {
  it("Verify that an invalid child node type will throw.", () => {
    const propertyMapNode = parser.parseFromString(
      validPropertiesMarkup + "<unknown_child_node /></properties>",
      "text/xml"
    ).documentElement;
    expect(() => {
      const tmxPropertyMap = new TMXPropertyMap();
      tmxPropertyMap.import(propertyMapNode);
    }).toThrow();
  });

  it("Verify that valid properties parse.", () => {
    const propertyMapNode = parser.parseFromString(
      validPropertiesMarkup + validPropertyMarkup + "</property></properties>",
      "text/xml"
    ).documentElement;

    const tmxPropertyMap = new TMXPropertyMap();
    tmxPropertyMap.import(propertyMapNode);
    expect(tmxPropertyMap.hasOwnProperty("valid")).toBeTruthy();
  });
});
