/* eslint-disable @typescript-eslint/no-explicit-any */
import { Base64 } from 'js-base64';
import pako from 'pako';

export function unzip(b64Data: string): any {
  const strData = Base64.atob(b64Data);
  const charData = strData.split('').map(x => x.charCodeAt(0));
  const binData = new Uint8Array(charData);
  const data = pako.ungzip(binData);

  // Slice handling to prevent memory overflow
  let str = '';
  const chunk = 8 * 1024;
  for (let i = 0; i < data.length / chunk; i++) {
    str += String.fromCharCode.apply(null, data.slice(i * chunk, (i + 1) * chunk) as any);
  }
  str += String.fromCharCode.apply(null, data.slice((data.length / chunk) * chunk) as any);

  const unzipStr = Base64.decode(str);
  let result: any;

  // Try to parse as JSON
  try {
    result = JSON.parse(unzipStr);
  } catch (error) {
    if (/Unexpected token o in JSON at position 0/.test((error as Error).message)) {
      // If JSON parsing fails, return as string
      result = unzipStr;
    }
  }

  return result;
}
