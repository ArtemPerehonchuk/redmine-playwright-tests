const Page = require('./page');
const testData = require('../data/testdata.json');

class LoginPage extends Page {
    constructor(page) {
        super(page);
    }

    async login() {
        this.loginField = this.page.locator('#username');
        this.passwordField = this.page.locator('#password');
        this.loginBtn = this.page.locator('#login-submit');

        await this.loginField.fill(testData.username);
        await this.passwordField.fill(testData.password);
        await this.loginBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    getMessageText() {
        this.successMessage = this.page.locator('#flash_notice');
        return this.successMessage.innerText();
    }
}

module.exports = LoginPage;