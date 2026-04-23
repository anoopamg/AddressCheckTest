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
    await this.addressInput.fill(text);
    await Promise.all([
        page.waitForResponse('**/api/address?q=Main**'), 
        input.fill('Main')
    ]);
  }

  async getSessionStatus() {
    return await this.page.evaluate(() => sessionStorage.getItem('isLoggedIn'));
  }
}

module.exports = { AppPage };
