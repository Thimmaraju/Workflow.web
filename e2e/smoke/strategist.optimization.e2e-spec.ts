import { UtilityPage } from '../utility.po';
import { NavPage } from '../common-page-objects/nav.po';
import { LoginPage } from '../common-page-objects/login.po';
import { browser, element, by, ExpectedConditions } from 'protractor';
import { OptimizationPage } from '../common-page-objects/optimization.po';
import { InventoryRecommendationPage } from '../common-page-objects/inventory-recommendation.po';
import { InventoryIQPage } from '../common-page-objects/inventory-iq.po';
import { screenshot } from '../screenshot';
import { SelectCustomersPage } from '../common-page-objects/select-customer.po';

describe('When a Strategist is on the optimizations page and there are opportunities', () => {
  let page: OptimizationPage;
  let util: UtilityPage;
  let nav: NavPage;
  let login: LoginPage;
  let iq: InventoryIQPage;
  let inv: InventoryRecommendationPage;
  let sel: SelectCustomersPage;

  beforeEach(() => {
    page = new OptimizationPage();
    iq = new InventoryIQPage();
    util = new UtilityPage();
    nav = new NavPage();
    login = new LoginPage();
    inv = new InventoryRecommendationPage();
    sel = new SelectCustomersPage();

    util.navigateTo('auth/login');
    browser.waitForAngularEnabled(false);
    login.loginWithCredential(util.getStrategistLogin());
    browser.wait(ExpectedConditions.visibilityOf(sel.getSelectCustomer()));
    sel.selectSpecificCustomer('Customer Name 001');
    browser.wait(ExpectedConditions.visibilityOf(nav.getOpportunitiesLink()));
    nav.getOpportunitiesLink().click();
  });

  afterEach(() => {
    nav.logout();
  });

  it('should be able to Accept an EM opportunity by not removing inventory about expire and move to Completed status', async () => {
    const opp = page.getFirstEM();
    opp.readId().then((id) => {
      const medGenericName = opp.getMedGenericName();
      opp.expand();
      util.sleep(5000);
      const section = opp.baseElem.$('.mat-expansion-panel-content');
      util.sleep(5000);
      expect(section.isDisplayed()).toBe(true, 'Opportunity did not expand');
      opp.clickViewButton();
      util.sleep('5000');
      iq.getAcceptButton_Rv().click();
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
      opp.expand();
      util.sleep(5000);
      const section = opp.baseElem.$('.mat-expansion-panel-content');
      util.sleep(5000);
      expect(section.isDisplayed()).toBe(true, 'Opportunity did not expand');
      opp.clickViewButton();
      util.sleep('5000');
      iq.getAcceptButton_Rv().click();
      util.sleep('5000');
      inv.getNotes().sendKeys('QA Test Note');
      inv.getExcessInventoryCheckbox().click();
      util.sleep('10000');
      inv.getExcessInventory().clear();
      inv.getExcessInventory().sendKeys('1');
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
      opp.expand();
      util.sleep(5000);
      const section = opp.baseElem.$('.mat-expansion-panel-content');
      util.sleep(5000);
      expect(section.isDisplayed()).toBe(true, 'Opportunity did not expand');
      opp.clickViewButton();
      util.sleep('5000');
      iq.getAcceptButton_Rv().click();
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
      opp.expand();
      util.sleep(5000);
      const section = opp.baseElem.$('.mat-expansion-panel-content');
      util.sleep(5000);
      expect(section.isDisplayed()).toBe(true, 'Opportunity did not expand');
      opp.clickViewButton();
      util.sleep('5000');
      iq.getAcceptButton_Rv().click();
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
      opp.expand();
      util.sleep(5000);
      const section = opp.baseElem.$('.mat-expansion-panel-content');
      util.sleep(5000);
      expect(section.isDisplayed()).toBe(true, 'Opportunity did not expand');
      opp.clickViewButton();
      util.sleep('5000');
      iq.getAcceptButton_Rv().click();
      util.sleep('5000');

      const errorMsg = page.getErrorElements();
      const errortext = page.getErrortext();

      inv.getExcessInventoryCheckbox().click();
      util.sleep('5000');
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
});
