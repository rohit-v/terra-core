/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
const screenshot = require('terra-toolkit').screenshot;

module.exports = {
  before: (browser, done) => {
    browser.resizeWindow(browser.globals.width, browser.globals.height, done);
  },

  afterEach: (browser, done) => {
    screenshot(browser, 'terra-base-layout', done);
  },

  'Displays a default Base Layout': (browser) => {
    browser.url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/base-layout-tests/default`);
    browser.expect.element('#base-layout-default').to.be.present;
  },

  'Displays an overflow disabled Base Layout': (browser) => {
    browser.url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/base-layout-tests/overflow-disabled`);
    browser.expect.element('#base-layout-disabled').to.be.present;
  },
};
