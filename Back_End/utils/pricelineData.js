const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.goto('https://www.pceline.com/?vrid=e997d49d07b12ac6811842a0db066512');

    await page.click('#endLocation-typeahead-downshift-container-input');
    await page.keyboard.type('ibis');
await page.waitForTimeout(2000)
    await page.click('.selectorgadget_suggested');

};

scrape()
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });
