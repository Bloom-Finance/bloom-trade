const sum = (a: any, b: any, positions: number) => {
  const factor = Math.pow(10, positions);
  return (
    (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor
  );
};
/**
 * It checks if a string is a valid base64 string
 * @param {string} string - The string to test.
 * @returns A boolean value.
 */
const isBase64 = (string: string) => {
  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(string);
};

/**
 * It takes a string and returns a number
 * @param {string} string - The string to convert to a date.
 * @returns The miliseconds of the date.
 */
const stringToMilisecondsDate = (string: string) => {
  const date = new Date(string);
  return date.getTime();
};
/**
 * Given two strings, parse them as floats, then sum them with the given number of decimals.
 * @param {string} a - The first number to add
 * @param {string} b - string, decimals: number) => {
 * @param {number} decimals - The number of decimal places to round to.
 * @returns A function that takes three arguments, two strings and a number, and returns the sum of the
 * two strings parsed as floats.
 */
const sumTwoFloatingStrings = (a: string, b: string, decimals: number) => {
  return sum(parseFloat(a), parseFloat(b), decimals);
};

/**
 * It takes a string, splits it into an array of words, capitalizes the first letter of each word, and
 * then joins the array back into a string
 * @param {string} word - string - the word to be capitalized
 * @returns The capitalized word is being returned.
 */
const capitalize = (word: string) => {
  const arr = word.split(' ');

  //loop through each element of the array and capitalize the first letter.

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  //Join all the elements of the array back into a string
  //using a blankspace as a separator
  const str2 = arr.join(' ');
  return str2;
};

/**
 * It takes a hex color code and an alpha value, and returns an rgba color code
 * @param {any} hex - The hexadecimal color value.
 * @param [alpha=1] - The opacity of the color.
 * @returns A string with the rgba value of the hex color.
 */
const hex2rgba = (hex: any, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x: string) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * It takes a string and returns a base64 encoded string
 * @param {string} string - The string to convert to base64.
 * @returns A base64 encoded string.
 */
const toBase64 = (string: string) => {
  return Buffer.from(string).toString('base64');
};

/**
 * It takes a base64 string and returns the decoded string
 * @param {string} base64 - The base64 string to decode.
 */
const fromBase64 = (base64: string) => {
  Buffer.from(base64, 'base64').toString('ascii');
};

export {
  isBase64,
  stringToMilisecondsDate,
  sumTwoFloatingStrings,
  capitalize,
  hex2rgba,
  toBase64,
  fromBase64,
};
