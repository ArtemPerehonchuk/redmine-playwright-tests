const Page = require('./page');
const { expect } = require('@playwright/test');
const testData = require('../data/testdata.json');

const username = 'myvalidtester';
const userPassword = 'qwerty12'

class LoginPage extends Page {
    constructor(page) {
        super(page);
    }

    async login() {
        this.loginField = this.page.locator('#username');
        this.passwordField = this.page.locator('#password');
        this.loginBtn = this.page.locator('#login-submit');

        await this.loginField.fill(username);
        await this.passwordField.fill(userPassword);
        await this.loginBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async checkMessageText() {
        this.successMessage = this.page.locator('#flash_notice');
        await expect(this.successMessage).toContainText('Account was successfully created')
    }
}

module.exports = LoginPage;