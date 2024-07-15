const fs = require('fs');
const Page = require('./page');
const { generateRandomLogin, generateRandomPassword, generateRandomName, generateEmail} = require('../utils/randomdata');
const axios = require('axios');
let testData = require('../data/testdata.json');

const API_KEY = '9451c980-67cd-4e9e-8227-1de8c80ea945';
const NAMESPACE = 'ldrqc';

class RegisterPage extends Page {
    constructor(page) {
        super(page);
    }

    async fillLogin() {
        const userNameField = this.page.locator('#user_login');
        this.generatedLogin = generateRandomLogin();
        await userNameField.fill(this.generatedLogin);
        this.updateTestData('username', this.generatedLogin);
    }

    async fillPassword() {
        const passwordField = this.page.locator('#user_password');
        const passwordConfirmationField = this.page.locator('#user_password_confirmation');
        this.generatedPassword = generateRandomPassword();
        await passwordField.fill(this.generatedPassword);
        await passwordConfirmationField.fill(this.generatedPassword);
        this.updateTestData('password', this.generatedPassword);
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
        this.generatedEmail = await generateEmail(); 
        const emailField = this.page.locator('#user_mail');
        await emailField.fill(this.generatedEmail);
    }

    async submitRegisterForm() {
        const submitButton = this.page.locator('input[name="commit"]');
        await submitButton.click();
    }

    async navigateToActivationLink() {
        const [namespace, tag] = this.generatedEmail.split('@')[0].split('.');
        const maxRetries = 10; 
        const delayBetweenRetries = 5000; 

        let activationEmail = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const response = await axios.get('https://api.testmail.app/api/json', {
                params: {
                    apikey: API_KEY,
                    namespace: namespace,
                    tag: tag,
                    pretty: true
                }
            });

            const emails = response.data.emails;
            activationEmail = emails.find(email => email.subject.includes('Redmine account activation'));
            if (activationEmail) {
                break; 
            }
            await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
        }

        if (!activationEmail) {
            throw new Error('Activation email not found');
        }

        const activationLinkMatch = activationEmail.html.match(/https:\/\/www.redmine.org\/account\/activate\?token=[a-zA-Z0-9]+/);
        if (!activationLinkMatch) {
            throw new Error('Activation link not found in email');
        }
        const activationLink = activationLinkMatch[0];

        await this.page.goto(activationLink);
    }

    async getLoginDetails() {
        const userNameField = this.page.locator('#user_login');
        const lastGeneratedLogin = this.generatedLogin;
        const filledLoginValue = await userNameField.inputValue();
        
        return {
            lastGeneratedLogin,
            filledLoginValue
        };
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

    updateTestData(key, value) {
        testData[key] = value;
        fs.writeFileSync('./data/testdata.json', JSON.stringify(testData, null, 2));
    }
}

module.exports = RegisterPage;