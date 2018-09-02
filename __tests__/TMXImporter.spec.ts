import {TMXImporter} from '../src/TMXImporter';
import fs = require('fs');

const basicLevel = fs.readFileSync('maps/Level1.tmx');
const csvLevel = fs.readFileSync('maps/CSVCoded.tmx');
const base64Level = fs.readFileSync('maps/Base64Coded.tmx');


describe('Make sure a standard level can load.', () => {
  test('Load a basic level using TMXImporter.loadFromString', () => {
    const importer = new TMXImporter();
    importer.loadFromString(basicLevel.toString());
  });

  test('Load a CSV level using TMXImporter.loadFromString', () => {
    const importer = new TMXImporter();
    importer.loadFromString(csvLevel.toString());
  });

  test('Load a Base64 level using TMXImporter.loadFromString', () => {
    const importer = new TMXImporter();
    importer.loadFromString(base64Level.toString());
  });

  test('Investigate Map', () => {
    const tmxMap = new TMXImporter().loadFromString(basicLevel.toString());
    const tmxMap2 = new TMXImporter().loadFromString(csvLevel.toString());
    expect(tmxMap.layerCount).toEqual(2);
    expect(tmxMap2.layerCount).toEqual(2);
  });
});