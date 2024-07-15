const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');
const LoginPage = require('../pages/loginpage');
const MyPage = require('../pages/mypage');
const RegisterPage = require('../pages/registerpage');

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
        await expect(registerPage.filledLoginValue).toEqual(registerPage.lastGeneratedLogin);

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

test.describe("Redmine tests", () => {
    let homePage;
    let loginPage;
    let myPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);

        await homePage.navigate('/');
        await homePage.clickSignIn();
        await page.waitForLoadState('domcontentloaded');
        await loginPage.login();
    });

    test('Get documentation issues list', async ({page}) => {
        myPage = new MyPage(page);
        homePage = new HomePage(page);

        await homePage.clickMyPageLink();

        await myPage.clickAddDropDown();
        await myPage.selectIssuesItem();

        const issueBlockTitleText = await myPage.issuesBlockTitle.innerText();
        await expect(issueBlockTitleText).toContain('Issues');

        await myPage.clickCuctomQueryDropDown();
        await myPage.selectDocumentationIssuesItem();
        await myPage.clickSaveBtn();
        
        const documentationIssuesTitleText = await myPage.documentationIssuesTitle.innerText();
        await expect(documentationIssuesTitleText).toContain('Documentation issues');
        await expect(myPage.documentationIssuesContainer).toBeVisible();

        await myPage.clickCloseIcon();
    
    });

    test('Change the position of the section', async ({page}) => {
        myPage = new MyPage(page);
        homePage = new HomePage(page);
        
        await homePage.clickMyPageLink();

        await myPage.clickAddDropDown();
        await myPage.selectIssuesAssignedToMeItem();
        await expect(myPage.issuesAssignedToMeBlock).toBeVisible();

        await myPage.clickAddDropDown();
        await myPage.selectReportedIssuesItem();
        await expect(myPage.reportedIssuesBlock).toBeVisible();

        await myPage.dragAndDropReportedIssuesBlock();
        
        const issuesAssignedToMeIsBeforeReported = await myPage.isElementBefore();
        await expect(issuesAssignedToMeIsBeforeReported).toBeTruthy();

        await myPage.removeIssuesAssignedToMeBlock();
        await myPage.removeReportedIssuesBlock();
    
    });

    test('Filter issues by Author', async ({page}) => {
        homePage = new HomePage(page);
        
        await homePage.clickIssuesTab();
        await expect(await homePage.contentTitle.innerText()).toEqual('Issues');

        await homePage.clickAddFilterDropDown();
        await homePage.selectAuthorAddFilterDropDownOption();
        const receivedIssuesQuantity = await homePage.issuesQuantity.innerText();
        
        await homePage.clickAuthorDropDown();
        await homePage.selectAuthorFromDropDown();
        await homePage.clickApplayLink();
        const receivedNewIssuesQuantity = await homePage.issuesQuantity.innerText();

        const prevTotalIssues = parseInt(receivedIssuesQuantity.split('/')[1].replace(/\D/g, ''), 10);
        const newTotalIssues = parseInt(receivedNewIssuesQuantity.split('/')[1].replace(/\D/g, ''), 10);

        await expect(newTotalIssues).toBeLessThan(prevTotalIssues);
    
    });

    test('Add new issue', async ({page}) => {
        homePage = new HomePage(page);
        
        await homePage.clickIssuesTab();
        await expect(await homePage.contentTitle.innerText()).toEqual('Issues');

        await homePage.clickNewIssueLink();
        await expect(homePage.newIssueForm).toBeVisible();

        await homePage.fillSubjectField();
        const filledSubjectText = await homePage.subjectField.inputValue();
        const lastGeneratedSubjectText = await homePage.getGeneratedSubjectText();
        await expect(filledSubjectText).toEqual(lastGeneratedSubjectText);

        await homePage.fillDescriptionField();
        const filledDescriptionText = await homePage.descriptionField.inputValue();
        const lastGeneratedDescriptionText = await homePage.getGeneratedDescriptionText();
        await expect(filledDescriptionText).toEqual(lastGeneratedDescriptionText);

        await homePage.clickCreateBtn();
        const successMessageText = await homePage.getSuccessMessageText();
        await expect(successMessageText).toMatch(/Issue .* created/);
        await expect(homePage.issueDetailsBlock).toBeVisible();
    
    });

    test.afterEach(async ({page}) => {
        myPage = new MyPage(page);

        await myPage.signOutUser();
    });
});
