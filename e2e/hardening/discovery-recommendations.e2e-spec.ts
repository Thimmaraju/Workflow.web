import { UtilityPage } from '../utility.po';
import { NavPage } from '../common-page-objects/nav.po';
import { DiscoveryRecommendationPage } from './discovery-recommendations.po';
import { LoginPage } from '../common-page-objects/login.po';
import { screenshot } from '../screenshot';
import { browser, element, by, ExpectedConditions } from 'protractor';

describe('Discovery Recommendations', () => {
  let page: DiscoveryRecommendationPage;
  let util: UtilityPage;
  let nav: NavPage;
  let login: LoginPage;

  beforeEach(() => {
    page = new DiscoveryRecommendationPage();
    util = new UtilityPage();
    nav = new NavPage();
    login = new LoginPage();

    util.navigateTo('auth/login');

    const username = login.getUserNameElement();
    const password = login.getPasswordElement();
    const loginButton = login.getLoginButtonElement();

    const strategistCred = util.getStrategistLogin();
    username.sendKeys(strategistCred.username);
    password.sendKeys(strategistCred.password);

    loginButton.click();
    browser.wait(element(by.css('page-title')).isPresent());
    util.sleep(500);
  });

  afterEach(() => {
    nav.getProfileLogoutMenu().click();
    browser.wait(ExpectedConditions.visibilityOf(nav.getLogoutButton()));
    util.sleep(500);
    nav.getLogoutButton().click();
  });

  it('should have at least one inventory reduction recommendation', async () => {
    util.getMenuAddedRecommendations().click();
    const message = page.getMessageElement();
    browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(message)));
    const addedIRRecommendation = page.getInventoryReductionRecommendation().isPresent();
    expect(addedIRRecommendation).toBeTruthy();
    screenshot();
  });
});
