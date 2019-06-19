import { element, by, $ } from 'protractor';

export class InventoryRecommendationPage {
  getMaxLevel = () => $('#MaxLevel');
  getReorderLevel = () => $('#ReorderLevel');
  getCriticalLevel = () => $('#CriticalLevel');
  getExcessInventory = () => element(by.id('ExcessInventory'));
  removeparbtn = () => element(by.id('RemovetoPar'));
  getNotes = () => element(by.id('Notes'));
  getExcessInventoryCheckbox = () => $('.mat-checkbox-inner-container');
  getAcceptButton = () => $('#SubmitChange');
  getDoneButton = () => $('#DoneButton');
  getEmptyLocation = () => $('.empty-row.ng-star-inserted');
  getQuantityOnHand = () => $('#QuantityOnHand');
  getEarliestExpDate = () => $('#EarliestExpDate');

  getOmniHeader = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Omni")]'));
  getQuantityOnHandHeader = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Quantity On Hand")]'));
  getAverageDailyUseHeader = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Average Daily Use")]'));
  getAverageDailyUseDesc = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Average Daily Use")]/following-sibling::span[@class="sort-btn sort-desc datatable-icon-down"]'));
  getDaysOnHandHeader = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Days On Hand")]'));
  getEarliestExpiryDateHeader = () => element(by.xpath('//div[@class="datatable-header-cell-template-wrap"]/span[@class="ng-star-inserted" and contains(text(),"Earliest Expiration")]'));

  getFirstLocation = () => $('datatable-body-row');
  getMedicationDescription = () => $('#MedGenericName');
  getMedicationID = () => $('#JustificationLeft');
  getOmni = () => $('.medication-facility__location .text-left');
  getSite = () => $('.medication-facility__location[_ngcontent-c47]');
  getGeneratedDate = () => $('.medication-facility__date .text-left');


}
