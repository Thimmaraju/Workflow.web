import { UtilityPage } from '../utility.po';
import { LoginPage } from '../common-page-objects/login.po';
import { NavPage } from '../common-page-objects/nav.po';
import { screenshot } from '../screenshot';
import { DiscoveryDashboardPage } from '../common-page-objects/discovery-dashboard.po';
import { browser, element, by, ExpectedConditions, until } from 'protractor';

describe('Discovery Dashboard', () => {
  let page: DiscoveryDashboardPage;
  let util: UtilityPage;
  let Login: LoginPage;
  let nav: NavPage;

  beforeEach(() => {
    Login = new LoginPage();
    page = new DiscoveryDashboardPage();
    util = new UtilityPage();
    nav = new NavPage();
    const username = Login.getUserNameElement();
    const password = Login.getPasswordElement();
    const loginButton = Login.getLoginButtonElement();

    const strategistCred = util.getStrategistLogin();
    username.sendKeys(strategistCred.username);
    password.sendKeys(strategistCred.password);

    loginButton.click();
    browser.wait(element(by.css('page-title')).isPresent());

    util.navigateTo('/dashboard');
  });

  afterEach(() => {
    nav.getProfileLogoutMenu().click();
    browser.wait(ExpectedConditions.visibilityOf(nav.getLogoutButton()));
    util.sleep(500);
    nav.getLogoutButton().click();
  });

  it('should display opportunities', async () => {
    const message = page.getMessageElement();
    browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(message)));
    expect(await page.getInventoryReductionOpportunity().count()).toBe(1);
    expect(await page.getExpiringMedicationsOpportunity().count()).toBe(1);
    expect(await page.getDataQualityOpportunity().count()).toBe(1);
    screenshot();
  });

  it('should sort by Omni and add recommendation', async () => {
    const sortButton = page.getSortButton();
    const inventoryReduction = page.getInventoryReductionOpportunity();
    const dataRow = page.rows();
    const message = page.getMessageElement();
    const loadingMessage = page.getLoadingMessageElement();
    let isAddButtonPresent = false;
    browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(message)));
    inventoryReduction.click();
    util.sleep(500);
    sortButton.click();
    util.sleep(1000);
    page.sortMenuItems(0).click();
    page.rows().then(rows => {
      rows[0].click();
    });
    browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(loadingMessage)));

    // Has the opportunity been added?
    page
      .getAddRecommendationButton()
      .isPresent()
      .then(x => {
        isAddButtonPresent = x;

        // No it hasn't
        // Add recommendation and note and submit
        if (isAddButtonPresent) {
          page.getAddRecommendationButton().click();
          page.waitForDialog();
          page.isNotesTextAreaPresent();
          page.addNoteAndSubmit();
        }

        if (!isAddButtonPresent) {
          // It has been added so delete it first
          // Then click the add button then add note and submit.
          page.getDeleteRecommendationButton().click();
          page.waitForDialog();
          page.getModelDeleteButton().click();
          util.sleep(2000);
          page.getAddRecommendationButton().click();
          page.waitForDialog();
          page.addNoteAndSubmit();
        }
      });

    util.sleep(1000);
    screenshot();
    expect(await browser.getCurrentUrl()).toContain('discovery');
  });
});
