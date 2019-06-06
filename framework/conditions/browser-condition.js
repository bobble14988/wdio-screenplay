import AbstractCondition from "./abstract-condition";

import { URL } from 'url';

export default class BrowserCondition extends AbstractCondition {
  execute() {
    console.log(`Asserting target: '${this.target}' - attribute: '${this.attribute}' - state: '${this.state}'`);

    switch (this.attribute) {
      case 'open':
      console.log(`\tExpected: ${this.state} - Actual: ${this.isBrowserOpen()}`);
        expect(this.isBrowserOpen()).toBe(this.state);
        break;
      case 'path':
        console.log(`\tExpected: ${this.state} - Actual: ${this.getBrowserPath()}`);
        expect(this.getBrowserPath()).toBe(this.state);
        break;
      default:
        throw new Error(`Unable to perform conditional validation against attribute ${this.attribute}`);
    }
  }

  isBrowserOpen() {
    return browser.getCurrentTabId() !== null;
  }

  getBrowserPath() {
    return new URL(browser.getUrl()).pathname;
  }
}