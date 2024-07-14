const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');
const RegisterPage = require('../pages/registerpage');
const LoginPage = require('../pages/loginpage');
const MyPage = require('../pages/mypage');

test.describe ("Redmine Registration Test", () => {
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

    test("Register new user", async ({page}) => {
        loginPage = new LoginPage(page);
        myPage = new MyPage(page);

        await registerPage.fillLogin();
        const lastGeneratedLogin = registerPage.getGeneratedLogin();
        const filledLoginValue = await registerPage.userNameField.inputValue();
        await expect(filledLoginValue).toEqual(lastGeneratedLogin);

        await registerPage.fillPassword();
        const lastGeneratedPassword = registerPage.getGeneratedPassword();
        const filledPasswordValue = await registerPage.passwordField.inputValue();
        const filledConfirmationValue = await registerPage.passwordConfirmationField.inputValue();
        const passwordFieldType = await registerPage.passwordField.getAttribute('type');
        const confirmationFieldType = await registerPage.passwordConfirmationField.getAttribute('type');

        await expect(filledPasswordValue).toEqual(lastGeneratedPassword);
        await expect(filledConfirmationValue).toEqual(lastGeneratedPassword);
        await expect(passwordFieldType).toEqual('password');
        await expect(confirmationFieldType).toEqual('password');

        await registerPage.fillFirstName();
        const lastGeneratedFirstName = registerPage.getGeneratedFirstName();
        const filledFirstNameValue = await registerPage.firstNameField.inputValue();
        await expect(filledFirstNameValue).toEqual(lastGeneratedFirstName);

        await registerPage.fillLastName();
        const lastGeneratedLastName = registerPage.getGeneratedLastName();
        const filledLastNameValue = await registerPage.lastNameField.inputValue();
        await expect(filledLastNameValue).toEqual(lastGeneratedLastName);

        await registerPage.fillEmail();
        const lastGeneratedEmail = registerPage.getGeneratedEmail();
        const filledEmailValue = await registerPage.emailField.inputValue();
        await expect(filledEmailValue).toEqual(lastGeneratedEmail);

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