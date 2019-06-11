import AbstractTask from "./abstract-task";

import Element from "../element";

import { app } from "../app";

export default class CreateAccountTask extends AbstractTask {
  execute() {
    console.log(`Running task ${this.task}`);

    // On the home page
    Element.click(app.elements.homePage.signInButton);
    
    // On the sign in page
    Element.setValue(app.elements.signInPage.createAccountEmailField, this.data.accountDetails.email);
    Element.click(app.elements.signInPage.createAnAccountButton);

    // On the create account page
    if (this.data.accountDetails.personalDetails.title === "Mr") {
      Element.click(app.elements.createAnAccountPage.titleMrRadioButton);
    } else if (this.data.accountDetails.personalDetails.title === "Mrs") {
      Element.click(app.elements.createAnAccountPage.titleMrsRadioButton);
    } else {
      throw new Exception("Unrecognised customer title, only 'Mr' or 'Mrs' valid.");
    }

    Element.setValue(app.elements.createAnAccountPage.firstNameField, this.data.accountDetails.personalDetails.firstName);
    Element.setValue(app.elements.createAnAccountPage.lastNameField, this.data.accountDetails.personalDetails.lastName);
    Element.setValue(app.elements.createAnAccountPage.emailField, this.data.accountDetails.personalDetails.email);
    Element.setValue(app.elements.createAnAccountPage.passwordField, this.data.accountDetails.personalDetails.password);

    Element.selectOption(app.elements.createAnAccountPage.dateOfBirthDaySelect, this.data.accountDetails.personalDetails.dateOfBirth.day);
    Element.selectOption(app.elements.createAnAccountPage.dateOfBirthMonthSelect, this.data.accountDetails.personalDetails.dateOfBirth.month);
    Element.selectOption(app.elements.createAnAccountPage.dateOfBirthYearSelect, this.data.accountDetails.personalDetails.dateOfBirth.year);

    Element.setValue(app.elements.createAnAccountPage.addressFirstNameField, this.data.accountDetails.personalDetails.firstName);
    Element.setValue(app.elements.createAnAccountPage.addressLastNameField, this.data.accountDetails.personalDetails.lastName);
    Element.setValue(app.elements.createAnAccountPage.addressCompanyField, this.data.accountDetails.addressDetails.company);
    Element.setValue(app.elements.createAnAccountPage.addressLine1Field, this.data.accountDetails.addressDetails.line1);
    Element.setValue(app.elements.createAnAccountPage.addressLine2Field, this.data.accountDetails.addressDetails.line2);
    Element.setValue(app.elements.createAnAccountPage.cityField, this.data.accountDetails.addressDetails.city);
    Element.selectOption(app.elements.createAnAccountPage.stateSelect, this.data.accountDetails.addressDetails.state);
    Element.setValue(app.elements.createAnAccountPage.postcodeField, this.data.accountDetails.addressDetails.postcode);
    Element.selectOption(app.elements.createAnAccountPage.countrySelect, this.data.accountDetails.addressDetails.country);
    Element.setValue(app.elements.createAnAccountPage.mobileNumberField, this.data.accountDetails.addressDetails.mobilePhone);
    Element.setValue(app.elements.createAnAccountPage.aliasField, this.data.accountDetails.addressDetails.alias);

    Element.click(app.elements.createAnAccountPage.registerButton);
  }
}