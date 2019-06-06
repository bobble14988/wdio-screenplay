import { fail } from 'assert';

/**
 * @file element.js 
 * @author Rob Livermore <rlivermore@deloitte.co.uk>
 * 
 * This file contains the Element class and functions enabling bespoke interactions
 * with Selenium WebDriver elements.
 * 
 * This class provides the following features:
 *  - Enables custom functionality to be executed before and after interactions
 *    with elements.
 *  - Enables custom detailed logging for each interaction and before/after 
 *    behaviour.
 *  - Enables a consistent approach to interacting with non-typical web elements
 *    such as bespoke dropdown or search boxes.
 *  - Enables variable selectors by replacing placeholders with values prior to 
 *    interactions, e.g. "//div[@id='result-{0}']" -> "//div[@id='result-1']"
 *  - Enables generated test data via implicitly invoked functions contained
 *    within test data strings, e.g. "{getRandomString(6)}" -> "tKqZGo"
 */

var DataFunctions = require('./data-functions');

/**
 * Element type definition.
 * @typedef {object} Element
 * @property {string} selector - The XPath selector locating the element in the DOM.
 * @property {Before} [before] - Functionality to execute before interacting with the element.
 * @property {After} [after] - Functionality to execute after interacting with the element.
 * @property {Meta} [meta] - Additional information about the element to support interactions.
 * 
 * Before type definition.
 * @typedef {object} Before
 * @property {number} [pause] - The length of time in milliseconds to pause before an interaction.
 * @property {boolean} [scroll] - Whether to scroll to the element before interacting with it.
 * 
 * After type definition.
 * @typedef {object} After
 * @property {number} [pause] - The length of time in milliseconds to pause before an interaction.
 * @property {boolean} [tab] - Whether to press the Tab key after interacting with an element.
 */

const SCREENSHOT_DIR = './reporting/screenshots';

export default class Element {

  /**
   * Executes the functionality defined in the element definition's 
   * before property.
   * 
   * Execution order:
   *  1. pause
   *  2. scroll
   * 
   * @param {Element} element - An element possibly containing a before property.
   * @static
   */
  static before(element) {
    if (element.before) {
      if (element.before.pause) {
        Element.pause(element.before.pause);
      }

      if (element.before.scroll) {
        var selector = Element.placeholderCheck(element.selector, arguments[1]);

        console.log(`Scrolling to ${selector}.`);

        browser.scroll(selector);
      }
    }

    if (global.validateFields) {
      this.validateFieldRules(element, arguments[1]);
    }

    if (element.before && element.before.screenshot && global.takeScreenshots) {
      this.takeScreenshot(element.selector, element.before.screenshot.scope, element.before.screenshot.suffix);
    }
  }
  
  /**
   * Executes the functionality defined in the element definition's 
   * after property.
   * 
   * Execution order:
   *  1. tab
   *  2. pause
   * 
   * @param {Element} element - An element possibly containing an after property.
   * @static
   */
  static after(element) {
    if (!element.after) return;

    if (element.after.tab) {
      Element.tab();
    }

    if (element.after.pause) {
      Element.pause(element.after.pause);
    }
  }
  
  /**
   * Clicks on the given element.
   * 
   * @param {Element} element - An element containing an XPath selector.
   */
  static click(element) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(1));

    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(1));

    console.log(`Clicking on ${selector}`);

    browser.element(selector).click();

    Element.after(element);
  }
  
  /**
   * Sets the text value an input element.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @param {string} value - The text value to be set.
   */
  static setValue(element, value) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(2));

    var val = Element.evaluate(value);
    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(2));

    console.log(`Setting value of ${selector} to ${val}`);
    
    browser.element(selector).setValue(val);

    Element.after(element);
  }
  
  /**
   * Returns the value attribute of an element.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @returns {string} The value of the given element.
   */
  static getValue(element) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(1));
    
    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(1));

    console.log(`Getting value of ${selector}`);

    var result = browser.element(selector).getValue();

    Element.after(element);

    console.log(`Value is ${result}`);

    return result;
  }

  /**
   * Returns the text of an element.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @returns {string} The text of the given element.
   */
  static getText(element) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(1));

    let selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(1));

    console.log(`Getting text of ${selector}`);

    let result = browser.element(selector).getText();

    console.log(`Text is ${result}`);

    Element.after(element);

    return result;
  }
  
  /**
   * Selects an option of a select element by its displayed text.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @param {string} optionText - The displayed text of the option to be selected.
   */
  static selectOption(element, optionText) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(2));
    
    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(2));

    console.log(`Selecting value of ${optionText} on ${selector}`);

    browser.element(selector).selectByVisibleText(optionText);

    Element.after(element);
  }

  /**
   * Returns the number of elements on the current DOM matched by the given element's selector.
   * 
   * @param {Element} element - An element containing an XPath selector.
   */
  static count(element) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(1));

    let selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(1));

    console.log(`Getting count of ${selector}`);

    let count = browser.elements(selector).value.length;

    console.log(`Count is ${count}`);

    Element.after(element);

    return count;
  }
  
  /**
   * Determines whether an element exists in the DOM after waiting for a given period.
   * 
   * Note: This function contains an explicit wait. To prevent the explit and implicit wait times
   *       stacking, the implicit wait is temporarily disabled.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @param {number} waitTime - The amount of time in milliseconds to wait for the element to exist.
   * @returns {boolean} True if the element exists after or during the wait period, false otherwise.
   */
  static exists(element, waitTime) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(2));
    
    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(2));

    var result;

    try {
      // Setting implicit wait time to 0 temporarily to stop the explicit and implicit waits stacking.
      var timeoutVal = browser.timeouts().value.implicit;
      browser.timeouts('implicit', 0);

      if (!waitTime) {
        console.log(`waitTime not defined, using implicit wait duration of ${timeoutVal}`);
        waitTime = timeoutVal;
      }

      console.log(`Waiting ${waitTime} milliseconds for ${selector} to exist.`);
      result = browser.waitForExist(selector, waitTime);
    } catch (err) {
      console.log(`Error while waiting: ${err.message}`);
      result = false;
    } finally {
      // Reset implicit wait time.
      browser.timeouts('implicit', timeoutVal);
    }

    console.log(`\tExist result: ${result}`);

    Element.after(element);

    return result;
  }
  
  /**
   * Determines whether an existing element is enabled and ready to be interacted with.
   * 
   * @param {Element} element - An element containing an XPath selector.
   * @returns {boolean} True if an element exists in the DOM and is enabled, false otherwise.
   */
  static enabled(element) {
    Element.before(element, Array.prototype.slice.call(arguments).slice(1));
    
    var selector = Element.placeholderCheck(element.selector, Array.prototype.slice.call(arguments).slice(1));

    console.log(`Checking if ${selector} is enabled`);

    var result = browser.element(selector).isEnabled();

    console.log(`\tResult: ${result}`);

    Element.after(element);

    return result;
  }
  
  /**
   * Checks the given value string for this framework's predefined function syntax and executes
   * any found function by invoking it from the DataFunctions module.
   * 
   * Function syntax example:
   *  - "{getRandomString}" - Same as calling DataFunctions.getRandomString()
   *  - "{getRandomString(12, true)}" - Same as calling DataFunctions.getRandomString(12, true)
   * 
   * @param {string} value - The value string possibly containing a function.
   * @returns {*} The value of the evaluated function. If no function found, returns the given value.
   */
  static evaluate(value) {
    console.log(`Checking ${value} for function.`);

    if (value.startsWith('{') && value.endsWith('}')) {
      var func = value.substring(1, value.length - 1);
      var args;

      if (func.includes('(') && func.includes(')')) {
        args = func.substring(func.indexOf('(') + 1, func.indexOf(')')).split(',');
        func = func.substring(0, func.indexOf('('));

        console.log(`Evaluating DataFunctions[${func}](${args.join(',')})`);
      } else {
        console.log(`Evaluating DataFunctions[${func}]()`);
      }

      var result = DataFunctions[func](args);

      console.log(`Evaluation result is ${result}`);

      return result;
    } else return value;
  }
  
  /**
   * Checks a given selector for placeholders in this framework's predefined placeholder syntax and
   * replaces those placeholders with values defined in the values array.
   * 
   * Note: placeholders and values in the array need to be in the same order to be replaced correctly.
   * 
   * Placeholder syntax example:
   *  - placeholderCheck("//div[@id='{0}']//input[@text()='{1}']", "customer-details", "Customer Name");
   *    Returns "//div[@id='customer-details']//input[@text()='Customer Name"
   * 
   * @param {string} selector - An XPath selector possibly containing placeholders.
   * @param {Array.<string>} values - An array of values to replace the placeholders with.
   */
  static placeholderCheck(selector, values) {
    var replaced = selector;
    
    for (var i = 0; i < values.length; i++) {
      var find = `\\{${i}\\}`;
      var regex = new RegExp(find, "g");
      replaced = replaced.replace(regex, values[i]);
    }

    if (replaced !== selector) {
      console.log(`Placeholders replaced in selector\n\tOriginal: ${selector}\n\tReplaced: ${replaced}`);
    }

    return replaced;
  }

  /**
   * Before/After functions
   */
  
  static pause(milliseconds) {
    console.log(`Pausing for ${milliseconds} milliseconds.`);

    browser.pause(milliseconds);
  }
  
  static tab() {
    console.log(`Tabbing away. This is useful for fields with error messages (for example) which move the elements below after data input.`);

    browser.keys('Tab');
  }

  static takeScreenshot(selector, scope, fileNameSuffix) {
    var fileName = `${SCREENSHOT_DIR}/${fileNameSuffix}.png`;

    console.log(`Taking screenshot with scope ${scope} and filename ${fileName}`);

    if (selector) {
      try {
        browser.waitForExist(selector);
      } catch (error) {
        console.log(`Unable to take screenshot due to the error '${error.message}'.`);
        return;
      }
    }

    if (scope === 'viewport') {
      browser.saveViewportScreenshot(fileName);
    } else if (scope === 'document') {
      browser.saveDocumentScreenshot(fileName);
    } else if (scope === 'element') {
      browser.saveElementScreenshot(fileName, selector);
    }
  }

  /**
   * Validate fields function
   */

  static validateFieldRules(element) {
    if (!element.meta || element.validated) return;
    
    var selector = Element.placeholderCheck(element.selector, arguments[1]);

    // TODO - Define checks here for various field validation rules on your application's elements

    element.validated = true;
  }
}