const Page = require('./page');
const { expect} = require('@playwright/test');

class MyPage extends Page {
    constructor(page) {
        super(page);
        this.addDropDown = page.locator('[name="block"]');
    }

    async clickAddDropDown() {
        //this.addDropDown = this.page.locator('[name="block"]');
        await this.addDropDown.click();
    }

    async selectIssuesItem() {
        //this.addDropDown = this.page.locator('[name="block"]');
        await this.addDropDown.selectOption({ label: 'Issues' });
    }

    async selectIssuesAssignedToMeItem() {
        // this.addDropDown = this.page.locator('[name="block"]');
        await this.addDropDown.selectOption({ label: 'Issues assigned to me' });
    }

    async selectReportedIssuesItem() {
        // this.addDropDown = this.page.locator('[name="block"]');
        await this.addDropDown.selectOption({ label: 'Reported issues' });
    }

    async clickCuctomQueryDropDown() {
        this.customQueryDropDown = this.page.locator('#settings_issuequery_query_id');
        await this.customQueryDropDown.click();
    }

    async selectDocumentationIssuesItem() {
        this.customQueryDropDown = this.page.locator('#settings_issuequery_query_id');
        await this.customQueryDropDown.selectOption({ label: 'Documentation issues' });
    }

    async clickSaveBtn() {
        this.saveBtn = this.page.locator('input[type="submit"]');
        await this.saveBtn.click();
    }

    async clickCloseIcon() {
        this.closeIcon = this.page.locator('.icon-close');
        await this.closeIcon.click();
    }

    async checkIssuesBlockTitleText() {
        const issuesBlockTitleText = this.page.locator('#block-issuequery > h3');
        await expect(issuesBlockTitleText).toHaveText('Issues');
    }

    // get issuesBlockTitle() {
    //     return this.page.locator('#block-issuequery > h3');
    // } 

    async checkDocumentationIssuesTitle() {
        const documentationIssuesTitle = this.page.locator('a[href="/projects/redmine/issues?query_id=84"]');
        const documentationIssuesTitleText = await documentationIssuesTitle.innerText();
        await expect(documentationIssuesTitleText).toContain('Documentation issues');
    }

    get documentationIssuesContainer() {
        return this.page.locator('#block-issuequery');
    }

    get issuesAssignedToMeBlock() {
        return this.page.locator('#block-issuesassignedtome');
    }

    get reportedIssuesBlock() {
        return this.page.locator('#block-issuesreportedbyme');
    }

    async dragAndDropReportedIssuesBlock() {
        const moveBtn = await this.page.locator('#block-issuesreportedbyme > div:nth-child(1) > span');
        const issuesAssignedToMeBlock = await this.page.locator('#block-issuesassignedtome');
    
        await moveBtn.click();
    
        const moveBtnBox = await moveBtn.boundingBox();
        const issuesAssignedToMeBox = await issuesAssignedToMeBlock.boundingBox();
    
        if (moveBtnBox && issuesAssignedToMeBox) {
            await this.page.mouse.move(moveBtnBox.x + moveBtnBox.width / 2, moveBtnBox.y + moveBtnBox.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(issuesAssignedToMeBox.x + issuesAssignedToMeBox.width / 2, issuesAssignedToMeBox.y + issuesAssignedToMeBox.height / 2);
            await this.page.mouse.up();
        } else {
            throw new Error('Could not find bounding boxes for moveBtn or issuesAssignedToMeBlock');
        }
    }

    async removeIssuesAssignedToMeBlock () {
        this.issuesAssignedToMeBlockDeleteBtn = this.page.locator('[href="/my/remove_block?block=issuesassignedtome"]');
        await this.issuesAssignedToMeBlockDeleteBtn.click();
    }

    async removeReportedIssuesBlock () {
        this.reportedIssuesBlockDeleteBtn = this.page.locator('[href="/my/remove_block?block=issuesreportedbyme"]');
        await this.reportedIssuesBlockDeleteBtn.click();
    }

    async isElementBefore() {
        const issuesAssignedToMe = '#block-issuesassignedtome';
        const reportedIssues = '#block-issuesreportedbyme';

        const [element1, element2] = await Promise.all([
            this.page.locator(issuesAssignedToMe).elementHandle(),
            this.page.locator(reportedIssues).elementHandle()
        ]);

        const [box1, box2] = await Promise.all([
            element1.boundingBox(),
            element2.boundingBox()
        ]);

        if (!box1 || !box2) {
            throw new Error(`Could not find bounding boxes for provided locators`);
        }

        return box1.y < box2.y;
    }

    async signOutUser() {
        this.signOutlink = this.page.locator('.logout');
        await this.signOutlink.click();
    }
}

module.exports = MyPage;