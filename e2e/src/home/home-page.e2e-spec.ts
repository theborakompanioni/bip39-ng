import {HomePage} from './home-page';

describe('Home page', function () {
  let page;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should contain a primary button', () => {
    HomePage.navigateTo();
    expect<any>(HomePage.getNumberOfPrimaryButtons()).toBe(1);
  });
});
