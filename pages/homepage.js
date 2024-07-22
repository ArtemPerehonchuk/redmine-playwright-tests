const Page  = require('./page');
const { expect } = require('@playwright/test');
const { generateRandomName } = require('../utils/randomdata');

class HomePage extends Page {
    constructor(page) {
        super(page);
    }

    async clickRegister() {
        this.registerLink = this.page.locator('a', { hasText: 'Register' });
        await this.registerLink.click();
    }

    async clickSignIn() {
        this.signInLink = this.page.locator('a', { hasText: 'Sign in' });
        await this.signInLink.click();
    }

    async clickHomeLink() {
        this.homeLink = this.page.locator('a', { hasText: 'Home' });
        await this.homeLink.click();
    }

    async clickMyPageLink() {
        this.myPageLink = this.page.locator('a', { hasText: 'My page' });
        await this.myPageLink.click();
    }

    async clickIssuesTab() {
        this.issuesTab = this.page.locator('[href="/projects/redmine/issues"]');
        await this.issuesTab.click();
    }
    
    async checkIssuesContentTitle() {
        const contentTitle = this.page.locator('#content > h2');
        const contentTitleText = await contentTitle.innerText();
        await expect(contentTitleText).toContain('Issues');
    }

    async clickNewIssueLink() {
        this.newIssueLink = this.page.locator('.new-issue');
        await this.newIssueLink.click();
    }

    async fillSubjectField() {
        const subjectField = this.page.locator('#issue_subject');
        const generatedSubjectText = generateRandomName();
        await subjectField.fill(generatedSubjectText);
        const filledSubjectText = await subjectField.inputValue();
        await expect(filledSubjectText).toEqual(generatedSubjectText);
    }

    async fillDescriptionField() {
        const descriptionField = this.page.locator('#issue_description');
        const generatedDescriptionText = generateRandomName();
        await descriptionField.fill(generatedDescriptionText);
        const filledDescriptionText = await descriptionField.inputValue();
        await expect(filledDescriptionText).toEqual(generatedDescriptionText);
    }

    async clickCreateBtn() {
        this.createBtn = this.page.locator('input[value="Create"]');
        await this.createBtn.click();
    }

    async clickAddFilterDropDown() {
        this.addFilterDropDown = this.page.locator('#add_filter_select');
        await this.addFilterDropDown.click();
    }

    async selectAuthorAddFilterDropDownOption() {
        this.addFilterDropDown = this.page.locator('#add_filter_select');
        await this.addFilterDropDown.selectOption({ label: 'Author' });
    }

    async clickAuthorDropDown() {
        this.authorDropDown = this.page.locator('#values_author_id_1');
        await this.authorDropDown.click();
    }

    async selectAuthorFromDropDown() {
        this.authorDropDown = this.page.locator('#values_author_id_1');
        await this.authorDropDown.selectOption({label: 'Bernhard Rohloff'})
    }

    async clickApplayLink() {
        this.applayLink = this.page.locator('.buttons .icon-checked');
        await this.applayLink.click();
    }

    async checkIssueFormIsVisible() {
        this.newIssueForm = this.page.locator('#issue-form > div');
        await expect(this.newIssueForm).toBeVisible();
    }

    async checkSuccessMessage() {
        const issueDetailsBlock = this.page.locator('//*[@id="content"]/div[3]');
        const successMessageBlock = this.page.locator('#flash_notice');
        const succeMessageBlockText = await successMessageBlock.innerText();
        await expect(succeMessageBlockText).toMatch(/Issue .* created/);
        await expect(issueDetailsBlock).toBeVisible();
    }

    get issuesQuantity() {
        return this.page.locator('#content > span > span > span.items');
    }
}

module.exports = HomePage;

