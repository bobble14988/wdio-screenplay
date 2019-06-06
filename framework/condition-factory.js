import BrowserCondition from './conditions/browser-condition';
import ElementCondition from './conditions/element-condition';

export default class ConditionFactory {
  static issue(condition) {
    switch (condition.target) {
      case 'browser':
        return new BrowserCondition(condition);
      case 'element':
        return new ElementCondition(condition);
      default:
        throw new Error(`Cannot instansiate condition against object ${condition.target}.`);
    }
  }
}