exports.CalculatorPage = class CalculatorPage {
    constructor(page) {
        this.page = page;
    }
    async goto() {
    await this.page.goto('https://testsheepnz.github.io/BasicCalculator');
    await this.page.waitForSelector(".masthead");
    };


    async performCalculation(number1, number2, calculationAction) {
    await this.page.fill('#number1Field', number1);
    await this.page.fill('#number2Field', number2);
    await this.page.selectOption('#selectOperationDropdown', calculationAction);
    await this.page.click('#calculateButton');
    };
}