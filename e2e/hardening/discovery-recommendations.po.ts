import { element, by } from 'protractor';

export class DiscoveryRecommendationPage {

  getInventoryReductionRecommendation = () => element(by.id('inventoryReductionRecommendation'));

  getMessageElement = () => element(by.css('.message'));
}
