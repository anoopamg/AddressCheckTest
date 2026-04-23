const { test, expect } = require('@playwright/test');
const { AppPage } = require('./pages/AppPage');

test.describe.configure({ mode: 'serial' });

test.describe('User Workflow: Login to Logout', () => {
  let app;
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    app = new AppPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Empty Credentials', async () => {
    await app.goto();
    await app.login('', '');
    await expect(app.errorMsg).toHaveText('Please enter both fields.');
  });

  test('2. Invalid credentials', async () => {
    await app.goto();
    await app.login('admin', 'wrongpassword');
    await expect(app.errorMsg).toHaveText('Invalid credentials.');
  });

  test('3. Successful Login', async () => {
    await app.goto();
    await app.login('admin', 'password123');
    await expect(page).toHaveURL(/\/search/);
    expect(await app.getSessionStatus()).toBe('true');
  });

  test('4. Valid address: search and result', async () => {
    await page.route(/\/api\/address/, async route => {
      await route.fulfill({
        status: 200,
        json: { addresses: [{ full_address: '123 Main St, New York, NY' }] }
      });
    });

    await app.search('Main');
    await expect(app.resultItem).toHaveText('123 Main St, New York, NY');
  });

  test('5. Invalid address: hide list', async () => {
    await page.route(/\/api\/address/, async route => {
      await route.fulfill({ status: 200, json: { addresses: [] } });
    });

    await app.search('Fake Street 999999');
    await expect(app.resultItem).toBeHidden();
  });

  test('6. Input too short: clear list', async () => {
    await app.search('12');
    await expect(app.resultsList).toBeEmpty();
  });

  test('7. Successful Logout', async () => {
    await app.logoutBtn.click();
    await expect(page).toHaveURL('http://localhost:3000/index.html');
    expect(await app.getSessionStatus()).toBeNull();
  });
});
