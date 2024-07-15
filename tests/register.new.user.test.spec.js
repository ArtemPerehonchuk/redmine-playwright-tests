const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');
const RegisterPage = require('../pages/registerpage');
const LoginPage = require('../pages/loginpage');
const MyPage = require('../pages/mypage');

test.describe("Redmine Registration Test", () => {
    let homePage;
    let registerPage;
    let loginPage;
    let myPage;
    let performAfterTestActions = false;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        registerPage = new RegisterPage(page);

        await homePage.navigate('/');
        await homePage.clickRegister();
        await page.waitForLoadState('domcontentloaded');
    });

    test("Register new user", async ({ page }) => {
        loginPage = new LoginPage(page);
        myPage = new MyPage(page);

        await registerPage.fillLogin();
        const lastGeneratedLogin = registerPage.getGeneratedLogin();
        const filledLoginValue = await page.locator('#user_login').inputValue();
        await expect(filledLoginValue).toEqual(lastGeneratedLogin);

        await registerPage.fillPassword();
        const passwordDetails = await registerPage.getPasswordDetails();

        await expect(passwordDetails.filledPasswordValue).toEqual(passwordDetails.lastGeneratedPassword);
        await expect(passwordDetails.filledConfirmationValue).toEqual(passwordDetails.lastGeneratedPassword);
        await expect(passwordDetails.passwordFieldType).toEqual('password');
        await expect(passwordDetails.confirmationFieldType).toEqual('password');

        await registerPage.fillFirstName();
        await registerPage.fillLastName();
        const nameDetails = await registerPage.getNameDetails();

        await expect(nameDetails.filledFirstNameValue).toEqual(nameDetails.lastGeneratedFirstName);
        await expect(nameDetails.filledLastNameValue).toEqual(nameDetails.lastGeneratedLastName);

        await registerPage.fillEmail();
        const emailDetails = await registerPage.getEmailDetails();

        await expect(emailDetails.filledEmailValue).toEqual(emailDetails.lastGeneratedEmail);

        await registerPage.submitRegisterForm();
        await registerPage.navigateToActivationLink(page);
        await expect(page).toHaveURL('https://www.redmine.org/login');

        performAfterTestActions = true;
    });

    test.afterEach(async ({ page }) => {
        if (performAfterTestActions) {
            await loginPage.login();
            await myPage.removeIssuesAssignedToMeBlock();
            await myPage.removeReportedIssuesBlock();
            await myPage.signOutUser();
            performAfterTestActions = false;
        }
    });
});