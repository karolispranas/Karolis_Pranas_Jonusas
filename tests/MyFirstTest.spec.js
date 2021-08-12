const { test, expect } = require('@playwright/test');
const { DuckStartPage } = require('../pages/duckStartPage')
const { DuckResultsPage } = require('../pages/duckResultsPage')

test.describe('', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    startPage = new DuckStartPage(page);
    resultsPage = new DuckResultsPage(page);
  });
  test.beforeEach(async () => {
    await startPage.goto();
  });

  test('duckduckgo is loading', async () => {
  const duckLogo = await page.isVisible('#logo_homepage_link');
  expect(duckLogo).toBe(true);
});

test('Test that search is working', async () => {
  await startPage.initiateSearch("Test");
  const result1TextContent = await page.textContent('#r1-0');
  expect(result1TextContent).toContain('Test')
});

test('Test that search is working recorded by inspector', async () => {
  await page.fill('input[name="q"]', 'Test');
  // Click input[name="q"]
  await page.click('input[name="q"]');
  // Click input:has-text("S")
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://duckduckgo.com/?q=Test&ia=web' }*/),
    page.click('input:has-text("S")')
  ]);
  // Click #links div div:has-text("Test | Definition of Test by Merriam-WebsterYour browser indicates if you've vis")
  await page.click('#links div div:has-text("Test | Definition of Test by Merriam-WebsterYour browser indicates if you\'ve vis")');
  expect(page.url()).toBe('https://www.merriam-webster.com/dictionary/test');
});

  test('Check that cheat sheets are working', async () => {
  await startPage.initiateSearch('microsoft word cheat sheet');
  const isCheatSheetVisible = await page.isVisible('a[data-zci-link="cheat_sheets"]');
  const cheatSheetsTitle = await page.textContent('h3.c-base__title');
  expect(isCheatSheetVisible).toBe(true);
  expect(cheatSheetsTitle).toContain('Microsoft Word 2010');
});

  test('Check that url shortener works', async () => {
  await startPage.initiateSearch('shorten www.wikipedia.com');
  const shortenedUrl = await page.getAttribute('#shorten-url', 'value');
  await page.goto(shortenedUrl);
  const url = page.url();
  expect(url).toBe('https://www.wikipedia.org/');
});

  test('panda', async () => {
  await startPage.initiateSearch("intitle:panda");
  const results = await page.evaluate(() => Array.from(document.querySelectorAll('.result__title'), element => element.textContent));
    results.forEach(result => {
      expect(result).toContain("Panda");
    });
});

  const passwordsLengths = ['8', '16', '64'];
  passwordsLengths.forEach(passwordLength => {
    test(`Generate ${passwordLength} chracters long password`, async () => {
      await startPage.initiateSearch("password " + passwordLength);
      const generatedPassword = await resultsPage.getGeneratedPassword();
      console.log(generatedPassword);
      expect(generatedPassword.length).toEqual(+passwordLength)
    });
  });


  const invalidPasswordLengths = ['7', '65'];
  invalidPasswordLengths.forEach(passwordLength => {
    test(`Fails to Generate ${passwordLength} chracters long password`, async () => {
      await startPage.initiateSearch("password " + passwordLength);
      const isPasswordElementVisible = await page.isVisible(".c-base__sub");
      expect(isPasswordElementVisible).toEqual(false)
    });
  });
  });