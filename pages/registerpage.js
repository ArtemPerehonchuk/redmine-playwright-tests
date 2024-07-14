const fs = require('fs');
const Page = require('./page');
const { generateRandomLogin, generateRandomPassword, generateRandomName } = require('../utils/randomdata');
const easyYopmail = require('easy-yopmail');
let testData = require('../data/testdata.json');

class RegisterPage extends Page {
    constructor(page) {
        super(page);
    }

    async fillLogin() {
        this.userNameField = this.page.locator('#user_login');
        this.generatedLogin = generateRandomLogin();
        await this.userNameField.fill(this.generatedLogin);
        //this.updateTestData('username', this.generatedLogin);
    }

    async fillPassword() {
        this.passwordField = this.page.locator('#user_password');
        this.passwordConfirmationField = this.page.locator('#user_password_confirmation');
        this.generatedPassword = generateRandomPassword();
        await this.passwordField.fill(this.generatedPassword);
        await this.passwordConfirmationField.fill(this.generatedPassword);
        //this.updateTestData('password', this.generatedPassword);
    }

    async fillFirstName() {
        this.firstNameField = this.page.locator('#user_firstname');
        this.generatedFirstName = generateRandomName();
        await this.firstNameField.fill(this.generatedFirstName);
    }

    async fillLastName() {
        this.lastNameField = this.page.locator('#user_lastname');
        this.generatedLastName = generateRandomName();
        await this.lastNameField.fill(this.generatedLastName);
    }

    async fillEmail() {
        this.emailField = this.page.locator('#user_mail');
        this.generatedEmail = await easyYopmail.getMail();
        await this.emailField.fill(this.generatedEmail);
    }

    async submitRegisterForm() {
        this.submitButton = this.page.locator('input[name="commit"]');
        await this.submitButton.click();
    }

    async navigateToActivationLink() {
      this.inbox = await easyYopmail.getInbox(this.generatedEmail.split('@')[0]);
      this.activationEmail = this.inbox.inbox.find(email => email.subject.includes('Redmine account activation'));
      this.emailContent = await easyYopmail.readMessage(this.generatedEmail.split('@')[0], this.activationEmail.id, 'TXT');
      this.activationLink = this.emailContent.content.match(/https:\/\/www.redmine.org\/account\/activate\?token=[a-zA-Z0-9]+/)[0];
      await this.page.goto(this.activationLink);
    }

    getGeneratedLogin() {
        return this.generatedLogin;
    }

    getGeneratedPassword() {
        return this.generatedPassword;
    }

    getGeneratedFirstName() {
        return this.generatedFirstName;
    }

    getGeneratedLastName() {
        return this.generatedLastName;
    }

    getGeneratedEmail() {
        return this.generatedEmail;
    }

    updateTestData(key, value) {
      testData[key] = value;
      fs.writeFileSync('./data/testdata.json', JSON.stringify(testData, null, 2));
  }
}

module.exports = RegisterPage;