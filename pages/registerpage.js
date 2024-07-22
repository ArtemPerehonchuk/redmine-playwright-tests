const { expect } = require('@playwright/test');
const fs = require('fs');
const Page  = require('./page');
const { generateRandomLogin, generateRandomPassword, generateRandomName, generateEmail} = require('../utils/randomdata');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
let testData = require('../data/testdata.json');

const API_KEY = '9451c980-67cd-4e9e-8227-1de8c80ea945';
const NAMESPACE = 'ldrqc';

class RegisterPage extends Page {
    constructor(page) {
        super(page);
    }

    async fillLogin() {
        const userNameField = this.page.locator('#user_login');
        this.generatedLogin = faker.internet.userName();
        await userNameField.fill(this.generatedLogin);
        await expect(userNameField).toHaveValue(this.generatedLogin);
    }

    async fillPassword() {
        const passwordField = this.page.locator('#user_password');
        const passwordConfirmationField = this.page.locator('#user_password_confirmation');
        this.generatedPassword = faker.internet.password({ length: 8});
        await passwordField.fill(this.generatedPassword);
        await passwordConfirmationField.fill(this.generatedPassword);
        await expect(passwordField).toHaveValue(this.generatedPassword);
        await expect(passwordConfirmationField).toHaveValue(this.generatedPassword);
    }

    async fillFirstName() {
        const firstNameField = this.page.locator('#user_firstname');
        this.generatedFirstName = faker.person.firstName();
        await firstNameField.fill(this.generatedFirstName);
        await expect(firstNameField).toHaveValue(this.generatedFirstName);
    }

    async fillLastName() {
        const lastNameField = this.page.locator('#user_lastname');
        this.generatedLastName = faker.person.lastName();
        await lastNameField.fill(this.generatedLastName);
        await expect(lastNameField).toHaveValue(this.generatedLastName);
    }

    async fillEmail() {
        const emailField = this.page.locator('#user_mail');
        this.generatedEmail = faker.internet.email();
        await emailField.fill(this.generatedEmail);
        await expect(emailField).toHaveValue(this.generatedEmail);
    }

    async submitRegisterForm() {
        const submitButton = this.page.locator('input[name="commit"]');
        await submitButton.click();
    }
}

module.exports = RegisterPage;