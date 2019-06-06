import AbstractCondition from "./abstract-condition";

import Element from "../element";

var app = require("../app");

export default class ElementCondition extends AbstractCondition {
    execute() {
        console.log(`elementReference: ${this.elementReference}, attribute: ${this.attribute}, state: ${this.state}`);

        var element = eval(`app.${this.elementReference}`);

        if (this.attribute === 'exists') {
            expect(Element.exists(element)).toBe(this.state);
        } else if (this.attribute === 'text') {
            expect(Element.getText(element)).toBe(this.state);
        }
    }
}
