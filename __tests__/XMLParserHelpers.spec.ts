import {XmlParserHelpers} from '../src/XmlParserHelpers';

const parser = new DOMParser();

describe('Required Attribute String Tests', () => {
  it('A required string returns the right value.', () => {
    const node =
        parser.parseFromString('<test existing=\'true\'></test>', 'text/xml')
            .documentElement;
    expect(XmlParserHelpers.requiredNodeValue(node, 'existing'))
        .toEqual('true');
    expect(XmlParserHelpers.requiredAttrValue(node.attributes, 'existing'))
        .toEqual('true');
  });

  it('A required string throws if it does not exist.', () => {
    const node =
        parser.parseFromString('<test existing=\'true\'></test>', 'text/xml')
            .documentElement;
    expect(() => {
      XmlParserHelpers.requiredNodeValue(node, 'nonexisting');
    }).toThrow();
    expect(() => {
      XmlParserHelpers.requiredAttrValue(node.attributes, 'nonexisting');
    }).toThrow();
  });
});

describe('Required Attribute Number Tests', () => {
  it('A required number returns the right value.', () => {
    const node = parser.parseFromString('<test num=\'5\'></test>', 'text/xml')
                     .documentElement;
    expect(XmlParserHelpers.requiredNodeInteger(node, 'num')).toEqual(5);
    expect(XmlParserHelpers.requiredAttrInteger(node.attributes, 'num'))
        .toEqual(5);
  })

  it('A required number throws if it does not exist.', () => {
    const node = parser.parseFromString('<test num=\'5\'></test>', 'text/xml')
                     .documentElement;
    expect(() => {
      XmlParserHelpers.requiredNodeValue(node, 'missingnum');
    }).toThrow();
    expect(() => {
      XmlParserHelpers.requiredAttrValue(node.attributes, 'missingnum');
    }).toThrow();
  });

  it('A required number returns NaN if it fails to parse.', () => {
    const node =
        parser.parseFromString('<test num=\'notanum\'></test>', 'text/xml')
            .documentElement;
    expect(XmlParserHelpers.requiredNodeInteger(node, 'num')).toBeNaN();
    expect(XmlParserHelpers.requiredAttrInteger(node.attributes, 'num'))
        .toBeNaN();
  });
});