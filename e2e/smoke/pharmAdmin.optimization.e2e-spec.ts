import { UtilityPage } from '../utility.po';
import { NavPage } from '../common-page-objects/nav.po';
import { LoginPage } from '../common-page-objects/login.po';
import { browser, element, by, ExpectedConditions } from 'protractor';
import { OptimizationPage } from '../common-page-objects/optimization.po';
import { InventoryRecommendationPage } from '../common-page-objects/inventory-recommendation.po';
import { InventoryIQPage } from '../common-page-objects/inventory-iq.po';
import { screenshot } from '../screenshot';

describe('When a Pharm Admin is on the optimizations page and there are opportunities', () => {
  let page: OptimizationPage;
  let util: UtilityPage;
  let nav: NavPage;
  let login: LoginPage;
  let iq: InventoryIQPage;
  let inv: InventoryRecommendationPage;

  beforeEach(() => {
    page = new OptimizationPage();
    iq = new InventoryIQPage();
    util = new UtilityPage();
    nav = new NavPage();
    login = new LoginPage();
    inv = new InventoryRecommendationPage();

    util.navigateTo('auth/login');
    browser.waitForAngularEnabled(false);
    login.loginWithCredential(util.getPharmAdminLogin());
    browser.wait(ExpectedConditions.visibilityOf(nav.getProfileLogoutMenu()));
    browser.wait(ExpectedConditions.visibilityOf(page.getFirstIR().baseElem));
  });

  afterEach(() => {
    nav.logout();
  });

  it('should be able to add a note to an opportunity', async () => {
    const opp = page.getFirstIR();
    opp.expand();
    expect(opp.addNoteButton().isDisplayed()).toBe(true, 'Expected Add Note Button Not Visible');
    opp.clickAddNoteButton();
    expect(page.addNoteForm().isDisplayed()).toBe(true, 'Add note form did not pop up');
    expect(page.addNoteCancelButton().isDisplayed()).toBe(true, 'Add note cancel button missing');
    expect(page.addNoteConfirmButtom().isDisplayed()).toBe(true, 'Add note confirm button missing');
    expect(page.addNoteConfirmButtom().isEnabled()).toBe(false, 'Add note confirm button should be disabled');
    page.closeAddNote();
    expect(page.addNoteForm().isPresent()).toBe(false, 'Add note form did not pop up');
  });

  it('should be able to view more details of an opportunity', async () => {
    const opp = page.getFirstIR();
    opp.viewDetails();
    expect(browser.getCurrentUrl()).toContain('inventory-iq');
  });

  it('should be able to Accept an IR opportunity and move to In Progress status', async () => {
    const opp = page.getFirstIR();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.getIRAcceptButton().click();
      browser.wait(ExpectedConditions.visibilityOf(inv.getMaxLevel()));
      util.sleep('1000');
      inv.getNotes().sendKeys('QA Test Note');
      inv.getExcessInventoryCheckbox().click();
      util.sleep('10000');
      inv.getExcessInventory().clear();
      util.sleep('5000');
      inv.getExcessInventory().sendKeys('1');
      util.sleep('5000');
      inv.getAcceptButton().click();
      util.sleep('7000');
      const DoneButton = inv.getDoneButton();
      browser.wait(ExpectedConditions.visibilityOf(DoneButton));
      expect(browser.isElementPresent(DoneButton)).toBe(true, 'IR Submisison failed');
      inv.getDoneButton().click();
      util.sleep('3000');
      page.getInProgressTab().click();
      util.sleep('3000');
      expect(page.getSpecificIRActiveTab(id).isDisplayed()).toBe(true, 'Opportunity is not In Progress.');
    });
  });

  it('should be able to Accept an EM opportunity by not removing inventory about expire and move to Completed status', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      const medGenericName = opp.getMedGenericName();
      opp.viewDetails();
      iq.getEMAcceptButton().click();
      util.sleep('5000');
      inv.getNotes().sendKeys('QA Test Note');
      inv.getAcceptButton().click();
      util.sleep('7000');
      const DoneButton = inv.getDoneButton();
      browser.wait(ExpectedConditions.visibilityOf(DoneButton));
      expect(browser.isElementPresent(DoneButton)).toBe(true, 'EM Submisison failed');
      inv.getDoneButton().click();
      util.sleep('4000');
      page.getCompletedTab().click();
      util.sleep('3000');
      medGenericName.then((result) => {
        expect(page.getCompleted_medGenericName(result).isDisplayed()).toBe(true, 'EM Opportunity is not Completed.');
      });
    });
  });

  it('should be able to Accept an EM opportunity by removing inventory about expire and move to In Progress status', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.getEMAcceptButton().click();
      util.sleep('5000');
      iq.getNotes().sendKeys('QA Test Note');
      inv.getExcessInventoryCheckbox().click();
      util.sleep('10000');
      inv.getExcessInventory().clear();
      util.sleep('5000');
      inv.getExcessInventory().sendKeys('1');
      util.sleep('5000');
      inv.getAcceptButton().click();
      util.sleep('7000');
      const DoneButton = inv.getDoneButton();
      browser.wait(ExpectedConditions.visibilityOf(DoneButton));
      expect(browser.isElementPresent(DoneButton)).toBe(true, 'EM Submisison failed');
      inv.getDoneButton().click();
      util.sleep('3000');
      page.getInProgressTab().click();
      util.sleep('3000');
      expect(page.getSpecificIRActiveTab(id).isDisplayed()).toBe(true, 'Opportunity is not In Progress.');
    });
  });

  it('should be displayed with Accept Expiring Medication Opportunity Details page', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.getEMAcceptButton().click();
      util.sleep('5000');

      inv.getMedicationDescription().getText().then(function (result) {
        expect(result.length).not.toEqual(0, 'Medication Description is empty or missing.');
        screenshot();
      });
      inv.getMedicationID().getText().then(function (result) {
        expect(result.length).not.toEqual(0, 'Medication ID is empty or missing.');
        screenshot();
      });
      inv.getOmni().getText().then(function (result) {
        expect(result.length).not.toEqual(0, 'Omni is empty or missing.');
        screenshot();
      });
      inv.getGeneratedDate().getText().then(function (result) {
        expect(result.length).not.toEqual(0, 'Generated on Date is empty or missing.');
        screenshot();
      });
    });
  });

  it('should be displayed with Medication Levels Details in Opportunity Details page', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.getEMAcceptButton().click();
      util.sleep('5000');

      inv.getMaxLevel().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Par field is empty or missing.');
        screenshot();
      });
      inv.getReorderLevel().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Reorder field is empty or missing.');
        screenshot();
      });
      inv.getCriticalLevel().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Critical Low field is empty or missing.');
        screenshot();
      });
      inv.getQuantityOnHand().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Quantity On Hand field is empty or missing.');
        screenshot();
      });
      inv.getEarliestExpDate().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Earliest Expiration Date field is empty or missing.');
        screenshot();
      });
    });
  });

  it('should be shown validations on invalid inputs to Excess Inventory', async () => {
    const opp = page.getFirstEM();
    opp.readId().then(async (id) => {
      opp.viewDetails();
      iq.getAcceptButton_Rv().click();
      util.sleep('5000');

      const errorMsg = page.getErrorElements();
      const errortext = page.getErrortext();

      inv.getExcessInventoryCheckbox().click();
      util.sleep('10000');
      inv.getExcessInventory().clear();
      iq.getNotes().clear();
      iq.getNotes().sendKeys('QA Test Note');
      util.sleep('2000');
      ExpectedConditions.presenceOf(errorMsg);
      util.sleep(1000);
      expect(await errortext.getText()).toContain('Excess Inventory is required');
      screenshot();

      inv.getExcessInventory().sendKeys('0');
      iq.getNotes().clear();
      iq.getNotes().sendKeys('QA Test Note');
      util.sleep('2000');
      ExpectedConditions.presenceOf(errorMsg);
      util.sleep(1000);
      expect(await errortext.getText()).toContain('Excess Inventory can\'t be less than 1');
      screenshot();
    });
  });

  it('should be displayed with Location Details of Excess Inventory for EM opportunity', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.getEMAcceptButton().click();
      util.sleep('5000');

      iq.getNotes().sendKeys('QA Test Note');

      inv.getQuantityOnHand().getAttribute('value').then(function (result) {
        expect(result.length).not.toEqual(0, 'Quantity On Hand field is empty or missing.');
        screenshot();
      });

      inv.getExcessInventoryCheckbox().click();
      util.sleep('10000');
      inv.getExcessInventory().clear();
      util.sleep('5000');
      inv.getExcessInventory().sendKeys('1');

      inv.getEmptyLocation().isPresent().then(exists => {
        if (exists) {
          inv.getEmptyLocation().getText().then(function (result) {
            expect(result).toContain('There are no alternative Omnis that currently have this medication assigned in the same site', 'Locations are present in the grid.');
            screenshot();
          });
        } else if (!exists) {
                  util.sleep('5000');

                  expect(inv.getOmniHeader().isDisplayed()).toBe(true, 'Omni header is not displayed in Location Details section');
                  expect(inv.getQuantityOnHandHeader().isDisplayed()).toBe(true, 'Quantity On Hand header is not displayed in Location Details section');
                  expect(inv.getAverageDailyUseHeader().isDisplayed()).toBe(true, 'Average Daily Use header is not displayed in Location Details section');
                  expect(inv.getAverageDailyUseDesc().isDisplayed()).toBe(true, 'Average Daily Use is not in descending order by default');
                  expect(inv.getDaysOnHandHeader().isDisplayed()).toBe(true, 'Days On Hand header is not displayed in Location Details section');
                  expect(inv.getEarliestExpiryDateHeader().isDisplayed()).toBe(true, 'Earliest Expiry Date header is not displayed in Location Details section');

                  inv.getFirstLocation().click();

                  util.sleep('5000');
                  inv.getAcceptButton().click();
                  util.sleep('7000');
                  const DoneButton = inv.getDoneButton();
                  browser.wait(ExpectedConditions.visibilityOf(DoneButton));
                  expect(browser.isElementPresent(DoneButton)).toBe(true, 'EM Submisison failed');
                  inv.getDoneButton().click();
                  util.sleep('3000');
                  page.getInProgressTab().click();
                  util.sleep('3000');
                  expect(page.getSpecificIRActiveTab(id).isDisplayed()).toBe(true, 'Opportunity is not In Progress.');
                }
            });
    });
  });

  it('Should be able to Decline an IR opportunity and move to Declined status', async () => {
    const opp = page.getFirstIR();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.declineOpportunityWithNote(`QA Test Note IR Expected Declined ${id}`, 'Ir');
      page.switchTab('Declined');
      expect(page.readSpecificCompletedOrDeclinedNote(id)).toBe(`QA Test Note IR Expected Declined ${id}`, 'Expected note returned was incorrect');
    });
  });

  it('Should be able to Decline an EM opportunity and move to Declined status', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      opp.viewDetails();
      iq.declineOpportunityWithNote(`QA Test Note EM Expected Declined ${id}`, 'Em');
      page.switchTab('Declined');
      expect(page.readSpecificCompletedOrDeclinedNote(id)).toBe(`QA Test Note EM Expected Declined ${id}`, 'Expected note returned was incorrect');
    });
  });
});
