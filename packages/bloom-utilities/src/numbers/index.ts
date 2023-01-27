import moment from 'moment';
import numeral from 'numeral';
// ----------------------------------------------------------------------

/**
 * If the number is an integer, format it as a whole number, otherwise format it as a decimal.
 * @param {string | number} number - The number to format.
 * @returns A function that takes a number or string and returns a formatted currency string.
 */
export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

/**
 * It takes a number, divides it by 100, and then formats it as a percentage
 * @param {number} number - number - The number to format
 * @returns A function that takes a number and returns a string.
 */
export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

/**
 * It takes a number or a string and returns a formatted number
 * @param {string | number} number - The number to format.
 * @returns A function that takes a number or string and returns a formatted number.
 */
export function fNumber(number: string | number) {
  return numeral(number).format();
}

/**
 * It takes a number and returns a string that is a shortened version of the number.
 * @param {string | number} number - The number you want to shorten.
 * @returns A function that takes a number and returns a string.
 */
export function fShortenNumber(number: string | number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

/**
 * If the number is a string, format it as a number, otherwise format it as a number.
 * @param {string | number} number - The number to be formatted.
 * @returns A function that takes a number and returns a string.
 */
export function fData(number: string | number) {
  return numeral(number).format('0.0 b');
}
/**
 * It takes a unix timestamp and returns a formatted date
 * @param {number} date - number - The date in Unix format.
 * @returns A string in the format of YYYY-MM-DDTHH:mm:ssZ
 */
export function fUnixDate(date: number) {
  return moment.unix(date).format();
}
/**
 * It takes a date in milliseconds and returns a formatted date string
 * @param {number} date - number - The date to format.
 * @param {string} [format] - The format of the date.
 * @returns A function that takes two parameters, date and format.
 */
export function fDate(date: number, format?: string) {
  return moment(date).format(format);
}
