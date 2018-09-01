export abstract class Base64 {
  private static readonly KEYCHARS: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  public static decode(input: string): string {
    let output = "";
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      const enc1 = Base64.KEYCHARS.indexOf(input.charAt(i++));
      const enc2 = Base64.KEYCHARS.indexOf(input.charAt(i++));
      const enc3 = Base64.KEYCHARS.indexOf(input.charAt(i++));
      const enc4 = Base64.KEYCHARS.indexOf(input.charAt(i++));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return output;
  }
}
