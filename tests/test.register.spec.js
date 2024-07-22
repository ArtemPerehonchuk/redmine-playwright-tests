const { test, expect } = require('@playwright/test');
const HomePage  = require('../pages/homepage');
const LoginPage  = require('../pages/loginpage');
const  RegisterPage  = require('../pages/registerpage');

test.describe("Redmine Registration Test", () => {
    let homePage;
    let registerPage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        registerPage = new RegisterPage(page);

        await homePage.navigate('/');
        await homePage.clickRegister();
        await page.waitForLoadState('domcontentloaded');
    });

    test("test case P01P: Submit registration form with valid credentials", async ({ page }) => {
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);

        await registerPage.fillLogin();
        await registerPage.fillPassword();
        await registerPage.fillFirstName();
        await registerPage.fillLastName();
        await registerPage.fillEmail();
        await registerPage.submitRegisterForm();
        await expect(page).toHaveURL('https://www.redmine.org/login');
        await loginPage.checkMessageText();
    });
});