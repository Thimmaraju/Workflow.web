import { LoginPage } from '../common-page-objects/login.po';
import { NavPage } from '../common-page-objects/nav.po';
import { SelectCustomersPage } from '../common-page-objects/select-customer.po';
import { UtilityPage } from '../utility.po';
import { screenshot } from '../screenshot';
import { browser, element, by, ExpectedConditions } from 'protractor';

describe('Authentication', () => {
  let page: LoginPage;
  let util: UtilityPage;
  let nav: NavPage;
  let sel: SelectCustomersPage;

  beforeEach(() => {
    page = new LoginPage();
    nav = new NavPage();
    util = new UtilityPage();
    sel = new SelectCustomersPage();
  });

  it('User should be able to login as a Pharm Admin with AWS Cognito Credentials', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const pharmAdminCreds = util.getPharmAdminLogin();

    username.sendKeys(pharmAdminCreds.username);
    password.sendKeys(pharmAdminCreds.password);

    loginButton.click();
    util.sleep(6000);
    page.verifySuccessfulLogin();
    screenshot();
    browser.wait(ExpectedConditions.visibilityOf(nav.getProfileLogoutMenu()));

    nav.getProfileLogoutMenu().click();
    browser.wait(ExpectedConditions.visibilityOf(nav.getLogoutButton()));
    util.sleep(500);
    nav.getLogoutButton().click();
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));
  });

  it('User should be able to login as a Strategist with AWS Cognito Credentials', async () => {
    browser.waitForAngularEnabled(false);
    util.navigateTo('/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getUserNameElement()));
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const strategistCred = util.getStrategistLogin();

    username.sendKeys(strategistCred.username);
    password.sendKeys(strategistCred.password);

    loginButton.click();
    util.sleep(2000);
    page.verifySuccessfulLogin();
    browser.wait(ExpectedConditions.visibilityOf(nav.getProfileLogoutMenu()));
    sel.selectSpecificCustomer('Customer Name 001');
    screenshot();
    util.sleep(3000);
    nav.getProfileLogoutMenu().click();
    util.sleep(1000);
    nav.getLogoutButton().click();
  });

  it('User should be able to login as a PharmAdmin with AD Credentials', async () => {

    const cust = 'ghs';
    const ADServe = page.getADServerElement();
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const ADpharmAdminCreds = util.getPharmAdminLoginAD(cust);
    browser.waitForAngularEnabled(false);
    util.navigateTo('https://' + cust + '.autotestworkflow.omnicellperformancecenter.com/auth/login');
    browser.wait(ExpectedConditions.visibilityOf(page.getADServerElement()));
    expect(loginButton.isDisplayed()).toBe(true);
    username.sendKeys(ADpharmAdminCreds.username);
    password.sendKeys(ADpharmAdminCreds.password);
    ADServe.click();
    element(by.cssContainingText('option', cust)).click();
    expect(loginButton.isEnabled()).toBe(true);
    loginButton.click();
    browser.wait(ExpectedConditions.visibilityOf(nav.getProfileLogoutMenu()));
    page.verifySuccessfulLogin();
    screenshot();
    nav.logout();
  });
});
