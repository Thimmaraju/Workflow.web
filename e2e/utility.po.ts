import { browser, element, by, ProtractorBy } from 'protractor';

export interface Credentials {
  ActiveDirectorySelect: string;
  username: string;
  password: string;
}

export class UtilityPage {
  sleep = (duration) => browser.sleep(duration);
  sortMenuItems = (index: number) => element.all(by.css('[mat-menu-item]')).get(index);
  navigateTo(url: string) {
    browser.driver
      .manage()
      .window()
      .setSize(1920, 1080);
    return browser.get(url);
  }

  getMenuAddedRecommendations = () => element(by.buttonText('Opportunities'));

  getPharmAdminLogin = () => this.getCred('', 'Pharm001', 'PCUserP@55');
  getPharmAdminLoginAD = (cust: string) => this.getCred(cust, 'e2epharmAdmin' + cust, '0mn!Cell101');
  getStrategistLogin = () => this.getCred('', 'Strategist001', 'PCUserP@55');
  // fix when AD update Stary is played.
  getADPharmAdminLogin = () => this.getCred('', 'eyob.erdachew2', '0mn!Cell101');
  getCred(cust: string, username: string, password: string): Credentials {
    const creds = {} as Credentials;
    creds.ActiveDirectorySelect = cust;
    creds.username = username;
    creds.password = password;
    return creds;
  }
}

export function waitForElement(selector: string) {
  return browser.isElementPresent(by.css(selector) as ProtractorBy);
}
