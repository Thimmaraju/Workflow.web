import { element, by, $, $$, browser, ExpectedConditions } from 'protractor';

export class InventoryIQPage {
  getIRAcceptButton = () => $('#IrAcceptButton');
  getEMAcceptButton = () => $('#EMAcceptButton');
  getIRDeclineButton = () => $('#IrDeclineButton');
  getEMDeclineButton = () => $('#EMDeclineButton');
  getAcceptButton_Rv = () => element(by.xpath('//button[contains(text(),"Accept")]'));
  getNotes = () => $('#Notes');
  getDeclineNotesButton = () => $('#AcceptDeclineButton');
  declineOpportunityWithNote = (note: string, opptype: string) => {
    browser.wait(ExpectedConditions.visibilityOf($(`#${opptype}DeclineButton`)));
    $(`#${opptype}DeclineButton`).click();
    browser.sleep(1000);
    this.getNotes().sendKeys(note);
    this.getDeclineNotesButton().click();
    browser.sleep(3000);
  }

}
