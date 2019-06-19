import { LoginPage } from '../common-page-objects/login.po';
import { UtilityPage } from '../utility.po';
import { NavPage } from '../common-page-objects/nav.po';
import { browser, element, by, ExpectedConditions } from 'protractor';
import { SelectCustomersPage } from '../common-page-objects/select-customer.po';

describe('Omnicell Strategist Login Page', () => {
  let page: LoginPage;
  let util: UtilityPage;
  let nav: NavPage;
  let sel: SelectCustomersPage;

  beforeEach(() => {
    page = new LoginPage();
    util = new UtilityPage();
    nav = new NavPage();
    sel = new SelectCustomersPage();
    util.navigateTo('/auth/login');
  });

  afterEach(() => {
    nav.getProfileLogoutMenu().click();
    browser.wait(ExpectedConditions.visibilityOf(nav.getLogoutButton()));
    nav.getLogoutButton().click();
  });

  it('should be able to login', async () => {
    page.loginWithCredential(util.getPharmAdminLogin());
    sel.selectSpecificCustomer('Kansas');
    expect(await browser.getCurrentUrl()).toContain('discovery');
  });
});
