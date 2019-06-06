export default class AbstractCondition {
  constructor(condition) {
    this.target = condition.target;
    this.elementReference = condition.elementReference;
    this.attribute = condition.attribute;
    this.state = condition.state;
  }

  getTarget() {
    return this.target;
  }

  getElementName() {
    return this.elementReference;
  }

  getAttribute() {
    return this.attribute;
  }

  getState() {
    return this.state;
  }

  execute() {
    throw new Error(`The execute method on the AbstractCondition class should not be called directly.`);
  }
}