const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');
const LoginPage = require('../pages/loginpage');
const MyPage = require('../pages/mypage');

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
