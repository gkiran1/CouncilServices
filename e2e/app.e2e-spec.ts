import { CouncilservicesPage } from './app.po';

describe('councilservices App', () => {
  let page: CouncilservicesPage;

  beforeEach(() => {
    page = new CouncilservicesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
