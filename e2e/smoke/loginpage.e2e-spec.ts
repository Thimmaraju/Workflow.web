import { LoginPage } from '../common-page-objects/login.po';
import { NavPage } from '../common-page-objects/nav.po';
import { UtilityPage } from '../utility.po';
import { screenshot } from '../screenshot';
import { browser, element, by, ExpectedConditions } from 'protractor';

describe('Login Page general test', () => {
  let page: LoginPage;
  let util: UtilityPage;
  let nav: NavPage;

  beforeEach(() => {
    page = new LoginPage();
    nav = new NavPage();
    util = new UtilityPage();
    util.navigateTo('/auth/login');
  });

  afterEach(() => {
    /*  browser
      .manage()
      .logs()
      .get('performance')
      .then(browserLogs => {
        browserLogs.forEach(browserLog => {
          var message = JSON.parse(browserLog.message).message;
          if (message.method == 'Network.responseReceived') {
            console.log(message);
          }
        });
      });*/
  });

  it('The system should display an error message to the user when a user enters a valid user and a invalid password', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    username.sendKeys('Pharm001');
    password.sendKeys('foo');

    loginButton.click();
    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('INCORRECT USERNAME OR PASSWORD.');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a invalid user and password', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    username.sendKeys('foo');
    password.sendKeys('bar');

    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('USER DOES NOT EXIST.');

    screenshot();
  });

  it('The system should display an error message to the user when a user fails to enter a User ID', async () => {
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    password.sendKeys('bar');

    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    util.sleep(1000);
    expect(await errortext.getText()).toContain('USER ID IS REQUIRED');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a user id but no password', async () => {
    const username = page.getUserNameElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    username.sendKeys('bar');

    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    util.sleep(1000);
    expect(await errortext.getText()).toContain('PASSWORD IS REQUIRED');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters invalid AD Credentials', async () => {
    const ADServe = page.getADServerElement();
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    const cust = 'ghs';
    util.navigateTo('https://' + cust + '.autotestworkflow.omnicellperformancecenter.com/auth/login');
    expect(await browser.getCurrentUrl()).toContain('login');



    expect(loginButton.isDisplayed);
    ADServe.click();
    element(
      by.cssContainingText('option', cust)
    ).click();
    username.sendKeys('foo');
    password.sendKeys('foo');
    expect(loginButton.isEnabled);
    loginButton.click();
    util.sleep(1000);

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('AUTHENTICATION FAILED');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a password but no user ID AD Credentials', async () => {

    const cust = 'ghs';
    const ADServe = page.getADServerElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();

    util.navigateTo('https://' + cust + '.autotestworkflow.omnicellperformancecenter.com/auth/login');
    expect(await browser.getCurrentUrl()).toContain('login');
    expect(loginButton.isDisplayed);
    ADServe.click();
    element(
      by.cssContainingText('option', cust)
    ).click();

    password.sendKeys('foo');

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('USER ID IS REQUIRED');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a user ID  but no password for AD Credentials', async () => {
    const cust = 'ghs';
    util.navigateTo('https://' + cust + '.autotestworkflow.omnicellperformancecenter.com/auth/login');
    expect(await browser.getCurrentUrl()).toContain('login');

    const ADServe = page.getADServerElement();
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();

    expect(loginButton.isDisplayed);
    ADServe.click();
    element(
      by.cssContainingText('option', cust)
    ).click();

    username.sendKeys('foo');

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('PASSWORD IS REQUIRED');
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a space at the end of the user id', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    username.sendKeys('bar ');
    password.sendKeys('foo');
    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain(
      '2 VALIDATION ERRORS DETECTED: VALUE \'BAR \' AT \'USERNAME\' FAILED TO SATISFY CONSTRAINT: MEMBER MUST SATISFY REGULAR EXPRESSION PATTERN:'
    );
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a space at the beginning of the user id', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    username.sendKeys(' bar');
    password.sendKeys('foo');
    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain(
      '2 VALIDATION ERRORS DETECTED: VALUE \' BAR\' AT \'USERNAME\' FAILED TO SATISFY CONSTRAINT: MEMBER MUST SATISFY REGULAR EXPRESSION PATTERN:'
    );
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a space in the Middle of the user id', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();

    username.sendKeys('b ar');
    password.sendKeys('foo');
    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain(
      '2 VALIDATION ERRORS DETECTED: VALUE \'B AR\' AT \'USERNAME\' FAILED TO SATISFY CONSTRAINT: MEMBER MUST SATISFY REGULAR EXPRESSION PATTERN:'
    );
    screenshot();
  });

  it('The system should display an error message to the user when a user enters a user id with special characters and password', async () => {
    const username = page.getUserNameElement();
    const password = page.getPasswordElement();
    const loginButton = page.getLoginButtonElement();
    const errorMsg = page.getErrorElements();
    const errortext = page.getErrortext();
    // missing \ do to formating
    username.sendKeys('~!@#$%^&*()_+-=[]{}|;,./:"<>?"');
    password.sendKeys('bar');

    loginButton.click();

    ExpectedConditions.presenceOf(errorMsg);
    expect(await errortext.getText()).toContain('USER DOES NOT EXIST.');

    screenshot();
  });
});
