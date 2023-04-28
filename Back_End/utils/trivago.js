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
  
    await page.goto('https://www.trivago.com/en-US/srl/camping-site-sahara-merzouga-camp?search=100-29310704;dr-20230427-20230429;rc-1-2');
    await page.waitForTimeout(1000);
    await page.click('.SearchInput_input__mPUpa w-full pr-10 truncate bg-white pl-9'); 
    await page.waitForTimeout(1000);

    await page.keyboard.type('Fes Ibis');
    await page.waitForTimeout(2000);
    await page.click('button[data-testid="search-button"]');

    await page.waitForTimeout(5000); 

    // await page.click('.uitk-fake-input uitk-form-field-trigger')[2]
    // await page.waitForTimeout(2000); 

    // await page.keyboard.type('ibis');

    await page.waitForTimeout(2000); 
  
    return 'Scraping completed.'; 
  };
scrape()
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });
