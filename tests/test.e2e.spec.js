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

    test('test case P02P: Get documentation issues list', async ({page}) => {
        myPage = new MyPage(page);
        homePage = new HomePage(page);

        await homePage.clickMyPageLink();
        await myPage.clickAddDropDown();
        await myPage.selectIssuesItem();
        await myPage.checkIssuesBlockTitleText();
        await myPage.clickCuctomQueryDropDown();
        await myPage.selectDocumentationIssuesItem();
        await myPage.clickSaveBtn(); 
        await myPage.checkDocumentationIssuesTitle();
        await expect(myPage.documentationIssuesContainer).toBeVisible();
        await myPage.clickCloseIcon();
    });

    test('test case P03P: Change the position of the section', async ({page}) => {
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

    test('test case P04P: Filter issues by Author', async ({page}) => {
        homePage = new HomePage(page);
        
        await homePage.clickIssuesTab();
        await homePage.checkIssuesContentTitle();

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

    test('test case P05P: Add new issue', async ({page}) => {
        homePage = new HomePage(page);
        
        await homePage.clickIssuesTab();
        await homePage.checkIssuesContentTitle();

        await homePage.clickNewIssueLink();
        await homePage.checkIssueFormIsVisible();

        await homePage.fillSubjectField();
        await homePage.fillDescriptionField();

        await homePage.clickCreateBtn();
        await homePage.checkSuccessMessage();
    });

    test.afterEach(async ({page}) => {
        myPage = new MyPage(page);

        await myPage.signOutUser();
    });
});
