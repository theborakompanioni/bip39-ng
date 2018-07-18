import {browser, by, element} from 'protractor';

export class HomePage {
  static navigateTo(): any {
    return browser.get('/');
  }

  static getNumberOfPrimaryButtons(): any {
    return element.all(by.css('.i-am-feeling-lucky-button')).count();
  }
}
