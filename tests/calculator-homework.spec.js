const { test, expect } = require('@playwright/test');
const { CalculatorPage } = require('../pages/calculatorPage')

const calculationActions = ['0', '1', '2', '3', '4'];
const calculationActionName = ['Add', 'Subtract', 'Multiply', 'Divide', 'Concatenate'];
const integerCalculationResults = ['20', '0', '100', '1', '1010'];
const calculationResults2 = ['5', '0', '6.25', '1', '2.52.5'];
const integerOnlyResults = ['5', '0', '6', '1'];
const versions = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
let answer, isVisible, isEnabled;


versions.forEach(version => {
  test.describe('', () => {
    let page;
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      startPage = new CalculatorPage(page);
      
    });
    test.beforeEach(async () => {
      await startPage.goto();
      await page.selectOption('#selectBuild', version);
    });


    calculationActions.forEach(calculationAction => {
      test.only(`Test if ${calculationActionName[calculationAction]} is working with integers on version ${version}`, async () => {
        await startPage.performCalculation('10', '10', calculationAction);
        answer = await page.inputValue('#numberAnswerField');
        expect(answer).toBe(integerCalculationResults[calculationAction]);
      });
    });


    calculationActions.forEach(calculationAction => {
      test.only(`Test if ${calculationActionName[calculationAction]} is working with non integers on version ${version}`, async () => {
        await startPage.performCalculation('2.5', '2.5', calculationAction);
        answer = await page.inputValue('#numberAnswerField');
        expect(answer).toBe(calculationResults2[calculationAction]);
      });
    });


    for (let i = 0; i < 4; i++) {
      test.only(`Test if integer only option is enabled, visible and working during ${calculationActionName[i]} on version ${version}`, async () => {
        await startPage.performCalculation('2.6', '2.5', calculationActions[i]);
        await page.check('#integerSelect');
        isEnabled = await page.isEnabled('#integerSelect');
        isVisible = await page.isVisible('#integerSelect');
        answer = await page.inputValue('#numberAnswerField');
        expect(isEnabled).toBe(true);
        expect(isVisible).toBe(true);
        expect(answer).toBe(integerOnlyResults[i]);
      });
    }


    test.only(`Test if integer only option is hidden and disabled during concatenate calculation on version ${version}`, async () => {
      await page.selectOption('#selectOperationDropdown', '4');
      isVisible = await page.isHidden('#integerSelect');
      isEnabled = await page.isDisabled('#integerSelect');
      expect(isVisible).toBe(false);
      expect(isEnabled).toBe(false);
    });

    test(`Test if the input fields are visible and enabled on version ${version}`, async () => {
      const field1Visible = await page.isVisible('#number1Field');
      const field2Visible = await page.isVisible('#number2Field');
      const field1Enabled = await page.isEnabled('#number1Field');
      const field2Enabled = await page.isEnabled('#number2Field');
      expect(field1Visible).toBe(true);
      expect(field2Visible).toBe(true);
      expect(field1Enabled).toBe(true);
      expect(field2Enabled).toBe(true);
    });


    test.only(`Test if the calculation button is pressent and enabled on version ${version}`, async () => {
      isVisible = await page.isVisible('#calculateButton');
      isEnabled = await page.isEnabled('#calculateButton');
      expect(isVisible).toBe(true);
      expect(isEnabled).toBe(true);
    });

    test(`Test if the max legth of the input fields are 10 on version ${version}`, async () => {
      const field1MaxLegth = await page.getAttribute('#number1Field', 'maxlength');
      const field2MaxLegth = await page.getAttribute('#number2Field', 'maxlength');
      const answerFieldMaxLegth = await page.getAttribute('#numberAnswerField', 'maxlength');
      expect(field1MaxLegth).toBe('10');
      expect(field2MaxLegth).toBe('10');
      expect(answerFieldMaxLegth).toBe('10');
    });


    calculationActions.forEach(calculationAction => {
      test(`Test if the clear button works using ${calculationActionName[calculationAction]} on version ${version}`, async () => {
        await startPage.performCalculation('10', '10', calculationAction);
        await page.click('#clearButton');
        answer = await page.inputValue('#numberAnswerField');
        expect(answer).toBe('');
      });
    });

  });
});
