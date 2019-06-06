import AbstractTask from "./abstract-task";

import Element from "../element";

import { app } from "../app";

export default class LoginTask extends AbstractTask {
  execute() {
    console.log(`Running task ${this.task}`);
    
    Element.setValue(app.elements.loginPage.usernameField, this.data.loginDetails.username);
    Element.setValue(app.elements.loginPage.passwordField, this.data.loginDetails.password);
    Element.click(app.elements.loginPage.loginButton);
  }
}