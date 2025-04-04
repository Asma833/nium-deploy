import _ from 'lodash';

/**
 * Capitalizes the first letter of a string
 * @param str - The input string
 * @returns The string with first letter capitalized
 * @example
 * capitalizeFirstLetter('hello') // returns 'Hello'
 * capitalizeFirstLetter(null) // returns ''
 */
export function capitalizeFirstLetter(str: string | null | undefined): string {
  return str ? _.capitalize(str.trim()) : '';
}

/**
 * Converts a snake_case string to camelCase
 * @param str - The input string in snake_case
 * @returns The string in camelCase
 * @example
 * convertToCamelCase('user_first_name') // returns 'userFirstName'
 */
export function convertToCamelCase(str: string): string {
  return _.camelCase(str);
}

/**
 * Converts a string to URL-friendly slug
 * @param text - The input string
 * @returns URL-friendly slug string
 * @example
 * slugify('Hello World!') // returns 'hello-world'
 */
export function slugify(text: string): string {
  return _.kebabCase(text);
}

/**
 * Truncates a string to a specified length
 * @param str - The input string
 * @param length - Maximum length of the resulting string (including ending)
 * @param ending - The ending to append (default: '...')
 * @returns Truncated string
 * @example
 * truncate('This is a long text', 10) // returns 'This is...'
 */
export function truncate(
  str: string,
  length: number,
  ending: string = '...'
): string {
  return _.truncate(str, { length, omission: ending });
}

/**
 * Removes special characters from a string
 * @param str - The input string
 * @returns String with only alphanumeric characters and spaces
 * @example
 * removeSpecialCharacters('Hello! @World#') // returns 'Hello World'
 */
export function removeSpecialCharacters(str: string): string {
  return _.deburr(str).replace(/[^a-zA-Z0-9 ]/g, '');
}

/**
 * Formats a phone number string to (XXX) XXX-XXXX
 * @param phone - The input phone number string
 * @returns Formatted phone number
 * @example
 * formatPhoneNumber('1234567890') // returns '(123) 456-7890'
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}

/**
 * Converts a string to title case
 * @param str - The input string
 * @returns String in title case where first letter of each word is capitalized
 * @example
 * toTitleCase('hello world') // returns 'Hello World'
 * toTitleCase('welcome to the app') // returns 'Welcome To The App'
 */
export function toTitleCase(str: string): string {
  return _.startCase(_.toLower(str));
}
