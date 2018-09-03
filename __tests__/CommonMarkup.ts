export class TMXMarkupFragments {
  // <properties> element
  public static readonly validPropertiesMarkup: string = "<properties>";
  public static readonly validPropertyMarkup: string =
    "<property name='valid' value='property' />";

  // <tileset> element
  public static readonly validTileSetMarkup: string =
    "<tileset firstgid='1' name='foo' tilewidth='16' tileheight='16'>";
  public static readonly validTileMarkup: string = "<tile id='1'>";
  public static readonly validEmptyTileMarkup: string = "<tile id='1' />";
}
