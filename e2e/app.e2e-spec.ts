import { DashboardPage } from './app.po';

describe('dashboard App', () => {
  let page: DashboardPage;

  beforeEach(() => {
    page = new DashboardPage();
  });

  it('should display message saying app works', async() => {
    page.navigateTo();
    expect(await page.getParagraphText()).toEqual('app works!');
  });
});
