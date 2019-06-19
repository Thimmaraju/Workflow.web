import { browser, element, by, $, $$, ElementFinder, ElementHelper } from 'protractor';
import './opportunityAccordion.po';
import { OpportunityAccordionComponent } from './opportunityAccordion.po';

export class OptimizationPage {
  getIROpportunities = () => $$('#InventoryReductionItemContainer');
  getFirstIR = () => new OpportunityAccordionComponent($('.IrMedListItem'));
  getFirstEM = () => new OpportunityAccordionComponent($('.EmMedListItem'));

  getSpecificIRActiveTab = (id: string) => $('.mat-tab-body-active #' + id);

  getCompleted_medGenericName = (name: string) => element(by.xpath('//span[@id="MedGenericName" and contains(text(),"' + name + '")]'));

  getErrorElements = () => element(by.css('mat-error'));
  getErrortext = () => element(by.className('mat-error ng-star-inserted'));

  getInProgressTab = () => $('#TabInProgress');
  getCompletedTab = () => $('#TabCompleted');
  getDeclinedTab = () => $('#TabDeclined');
  addNoteForm = () => $('#NewOpportunityForm');
  addNoteCancelButton = () => $('#CancelButton');
  addNoteConfirmButtom = () => $('#AddRecommendationButton');
  closeAddNote = () => {
    this.addNoteCancelButton().sendKeys('\n');
    browser.sleep(1000);
  }

  switchTab = (tab: string) => {
    $(`#Tab${tab}`).click();
    browser.sleep(3000);
  }

  readSpecificCompletedOrDeclinedNote = (id: string) => {
    $(`#${id}`).click();
    return $('#Notes').getText();
  }
}
