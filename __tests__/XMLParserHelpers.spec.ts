import { XmlParserHelpers } from "../src/XmlParserHelpers";

const parser = new DOMParser();

describe("Required Attribute String Tests", () => {
    test("A required string returns the right value.", () => {
        const node = parser.parseFromString("<test existing='true'></test>", "text/xml").documentElement;
        expect(XmlParserHelpers.requiredNodeValue(node, "existing")).toEqual("true");
    });
});