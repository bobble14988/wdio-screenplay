import AbstractTask from "./abstract-task";

import Element from "../element";

import { app } from "../app";

export default class SignInTask extends AbstractTask {
  execute() {
    console.log(`Running task ${this.task}`);

    // On the home page
    Element.click(app.elements.homePage.signInButton);
    
    // On the sign in page
    Element.setValue(app.elements.signInPage.emailField, this.data.signInDetails.email);
    Element.setValue(app.elements.signInPage.passwordField, this.data.signInDetails.password);
    Element.click(app.elements.signInPage.signInButton);
  }
}