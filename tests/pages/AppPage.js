const { expect } = require('@playwright/test');

class AppPage {
  constructor(page) {
    this.page = page;
    // Login Selectors
    this.userInput = page.locator('#username');
    this.passInput = page.locator('#password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.errorMsg = page.locator('#error-msg');

    // Search Selectors
    this.addressInput = page.locator('#address-input');
    this.resultsList = page.locator('#results');
    this.resultItem = page.locator('#results li');

    // Logout Selectors
    this.logoutBtn = page.getByRole('button', { name: 'Logout' });
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
  }

  async login(user, pass) {
    await this.userInput.fill(user);
    await this.passInput.fill(pass);
    await this.loginBtn.click();
  }

  async search(text) {
    if (text.length >= 3) {
      await Promise.all([
        // Use a dynamic pattern so it works for "Main" or any other text
        this.page.waitForResponse(res => res.url().includes('/api/address') && res.status() === 200),
        this.addressInput.fill(text)
      ]);
    }
    else {
      // Just fill, don't wait for a response that will never happen
      await this.addressInput.fill(text);
    }
  }

  async getSessionStatus() {
    return await this.page.evaluate(() => sessionStorage.getItem('isLoggedIn'));
  }
}

module.exports = { AppPage };
