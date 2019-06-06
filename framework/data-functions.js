/**
 * @file data-functions.js
 * @author Rob Livermore <rlivermore@deloitte.co.uk>
 * 
 * This file contains exported functions which can be implicitly called from test 
 * data in string form by wrapping the function name around braces, e.g. {getRandomString}
 * 
 * To include parameters in the function, the syntax to be used in the test data 
 * is {getRandomString(12)}
 * 
 * The functions called in this way are intepreted by the static evaluate() function
 * within Element class via the call: 
 *    var result = DataFunctions[func](args);
 * 
 * Using this method it is possible to set variable test data that is different
 * between tests and executions or when certain calculations need to be made for
 * dates, for example.
 */

import nino from 'fake-nino';

/**
 * Returns a pseudorandom string of the given length and includes
 * numerics if second parameter is true.
 * 
 * @param {number} length - The desired length (default 10)
 * @param {boolean} numerics - Whether or not to include numbers.
 * @returns {string} A pseudorandom alphanumeric string
 */
export function getRandomString(length, numerics) {
  var len;

  length ? len = length : len = 10;

  var result = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  if (numerics)
    possible += "0123456789";

  for (var i = 0; i < len; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));

  return result;
}

/**
 * Returns a pseudorandom integer between two numbers inclusive.
 * 
 * @param {number} min - The minimum number (inclusive)
 * @param {number} max - The maximum number (inclusive)
 * @returns {number} A pseudorandom integer.
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a generated UK National Insurance Number. Uses 'fake-nino' NPM library.
 * 
 * @see https://www.npmjs.com/package/fake-nino
 * 
 * @returns {string} - A generated NiNo.
 */
export function getRandomNino() {
  var result;

  // This code resolves an issue where sometimes the last character is not a letter as it should be.
  do {
    result = nino.generate();
  } while(!isNaN(result[result.length-1]))

  return result;
}

/**
 * Returns a number representing the day of the month offset from today by 
 * the given number of days. Prepends '0' if the result is a single character.
 * 
 * @example
 * // If today is 29/01/2019
 * // returns 08
 * getDaysOffsetFromTodayDay(10);
 * 
 * @param {number} days - The number of days to offset by.
 * @returns {number} The day of the month from today with the given offset.
 */
export function getDaysOffsetFromTodayDay(days) {
  console.log(`Evaluating the day from today with an offset of ${days} days.`);

  var today = new Date();
  var newDate = new Date();
  newDate.setTime(today.getTime() + days * 86400000);

  var result = newDate.getDate();

  if (result.toString().length === 1)
    return '0'.concat(result);

  if (result.toString() === "29" || result.toString() === "30" || result.toString() === "31")
    return "28";

  return result;
}

/**
 * Returns a number representing the month offset from today by the given number of 
 * days. Prepends '0' if the result is a single character.
 * 
 * @example
 * // If today is 29/01/2019
 * // returns 02
 * getDaysOffsetFromTodayDay(10);
 * 
 * @param {number} days - The number of days to offset by.
 * @returns {number} The month from today with the given days offset.
 */
export function getDaysOffsetFromTodayMonth(days) {
  console.log(`Evaluating the month from today with an offset of ${days} days.`);

  var today = new Date();
  var newDate = new Date();
  newDate.setTime(today.getTime() + days * 86400000);

  var result = newDate.getMonth() + 1;

  if (result.toString().length === 1)
    return '0'.concat(result);

  return result;
}

/**
 * Returns a number representing the year offset from today by the given number of 
 * days.
 * 
 * @example
 * // If today is 29/01/2019
 * // returns 2019
 * getDaysOffsetFromTodayDay(10);
 * 
 * @param {number} days - The number of days to offset by.
 * @returns {number} The year from today with the given days offset.
 */
export function getDaysOffsetFromTodayYear(days) {
  console.log(`Evaluating the year from today with an offset of ${days} days.`);

  var today = new Date();
  var newDate = new Date();
  newDate.setTime(today.getTime() + days * 86400000);
  return newDate.getFullYear();
}

/**
 * Returns a number representing the age of a person born on the given date. Date string
 * must be in the format YYYY/MM/DD.
 * 
 * @param {string} dateString - A date string in format YYYY/MM/DD representing a date of birth.
 * @returns {number} - The age since the given date.
 */
export function getAge(dateString) {
  console.log(`Evaluating the age with a date of birth of ${dateString} (YYYY/MM/DD format)`);

  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  console.log(`Age result is ${age}.`);
  
  return age;
}