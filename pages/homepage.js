const Page = require('./page');
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

    async clickNewIssueLink() {
        this.newIssueLink = this.page.locator('.new-issue');
        await this.newIssueLink.click();
    }

    async fillSubjectField() {
        this.subjectField = this.page.locator('#issue_subject');
        this.generatedSubjectText = generateRandomName();
        await this.subjectField.fill(this.generatedSubjectText);
    }

    async fillDescriptionField() {
        this.descriptionField = this.page.locator('#issue_description');
        this.generatedDescriptionText = generateRandomName();
        await this.descriptionField.fill(this.generatedDescriptionText);
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

    getGeneratedSubjectText() {
        return this.generatedSubjectText;
    }

    getGeneratedDescriptionText() {
        return this.generatedDescriptionText;
    }

    getSuccessMessageText() {
        this.successMessageBlock = this.page.locator('#flash_notice');
        return this.successMessageBlock.innerText();
    }

    get contentTitle() {
        return this.page.locator('#content > h2');
    }

    get newIssueForm() {
        return this.page.locator('#issue-form > div');
    }

    get issueDetailsBlock() {
        return this.page.locator('//*[@id="content"]/div[3]');
    }

    get issuesQuantity() {
        return this.page.locator('#content > span > span > span.items');
    }
}

module.exports = HomePage;

