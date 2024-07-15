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
        const userNameField = this.page.locator('#user_login');
        this.generatedLogin = generateRandomLogin();
        await userNameField.fill(this.generatedLogin);
    }

    async fillPassword() {
        const passwordField = this.page.locator('#user_password');
        const passwordConfirmationField = this.page.locator('#user_password_confirmation');
        this.generatedPassword = generateRandomPassword();
        await passwordField.fill(this.generatedPassword);
        await passwordConfirmationField.fill(this.generatedPassword);
    }

    async fillFirstName() {
        const firstNameField = this.page.locator('#user_firstname');
        this.generatedFirstName = generateRandomName();
        await firstNameField.fill(this.generatedFirstName);
    }

    async fillLastName() {
        const lastNameField = this.page.locator('#user_lastname');
        this.generatedLastName = generateRandomName();
        await lastNameField.fill(this.generatedLastName);
    }

    async fillEmail() {
        const emailField = this.page.locator('#user_mail');
        this.generatedEmail = await easyYopmail.getMail();
        await emailField.fill(this.generatedEmail);
    }

    async submitRegisterForm() {
        const submitButton = this.page.locator('input[name="commit"]');
        await submitButton.click();
    }

    async navigateToActivationLink() {
        const inbox = await easyYopmail.getInbox(this.generatedEmail.split('@')[0]);
        const activationEmail = inbox.inbox.find(email => email.subject.includes('Redmine account activation'));
        const emailContent = await easyYopmail.readMessage(this.generatedEmail.split('@')[0], activationEmail.id, 'TXT');
        const activationLink = emailContent.content.match(/https:\/\/www.redmine.org\/account\/activate\?token=[a-zA-Z0-9]+/)[0];
        await this.page.goto(activationLink);
    }

    async getPasswordDetails() {
        const passwordField = this.page.locator('#user_password');
        const passwordConfirmationField = this.page.locator('#user_password_confirmation');
        const lastGeneratedPassword = this.generatedPassword;
        const filledPasswordValue = await passwordField.inputValue();
        const filledConfirmationValue = await passwordConfirmationField.inputValue();
        const passwordFieldType = await passwordField.getAttribute('type');
        const confirmationFieldType = await passwordConfirmationField.getAttribute('type');
        
        return {
            lastGeneratedPassword,
            filledPasswordValue,
            filledConfirmationValue,
            passwordFieldType,
            confirmationFieldType
        };
    }

    async getNameDetails() {
        const firstNameField = this.page.locator('#user_firstname');
        const lastNameField = this.page.locator('#user_lastname');
        const lastGeneratedFirstName = this.generatedFirstName;
        const filledFirstNameValue = await firstNameField.inputValue();
        const lastGeneratedLastName = this.generatedLastName;
        const filledLastNameValue = await lastNameField.inputValue();
        
        return {
            lastGeneratedFirstName,
            filledFirstNameValue,
            lastGeneratedLastName,
            filledLastNameValue
        };
    }

    async getEmailDetails() {
        const emailField = this.page.locator('#user_mail');
        const lastGeneratedEmail = this.generatedEmail;
        const filledEmailValue = await emailField.inputValue();

        return {
            lastGeneratedEmail,
            filledEmailValue
        };
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