/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const screenshot = require('terra-toolkit').screenshot;

module.exports = {
  before: (browser, done) => {
    browser.resizeWindow(browser.globals.width, browser.globals.height, done);
  },

  afterEach: (browser, done) => {
    screenshot(browser, 'terra-menu', done);
  },

  'Displays a default menu': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/menu-tests/default`);
  },
  'boundingRef prop': (browser) => {
    browser
      .url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/menu-tests/bounded`)
      .waitForElementPresent('#bounded-button', 1000)
      .click('#default-button')
      .waitForElementPresent('.terra-SubMenu-header', 1000)
      .waitForElementPresent('.terra-SubMenu-button', 1000);
  },
};
