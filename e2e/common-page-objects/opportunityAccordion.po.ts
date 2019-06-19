import { ElementFinder, browser, by, ExpectedConditions, $ } from 'protractor';

export class OpportunityAccordionComponent {
  baseElem: ElementFinder;

  constructor(elem: ElementFinder) {
    browser.sleep(10000);
    this.baseElem = elem;
  }

  expand = () => {
    this.baseElem.click();
    browser.sleep(8000);
  }

  viewButton = () => this.baseElem.element(by.className('ViewButton'));
  addNoteButton = () => this.baseElem.element(by.className('AddNoteButton'));
  clickAddNoteButton = () => {
    this.addNoteButton().click();
    browser.sleep(5000);
  }

  viewDetails = () => {
    this.expand();
    this.clickViewButton();
    browser.wait(ExpectedConditions.visibilityOf($('#NoteHistoryHeader')));
  }
  clickViewButton = () => this.viewButton().click();

  getMedGenericName = () => this.baseElem.element(by.id('MedGenericName')).getText();

  getNote = () => this.baseElem.element(by.id('Notes')).getText();
  readId = () => {
    return this.baseElem.getAttribute('id');
  }
}
