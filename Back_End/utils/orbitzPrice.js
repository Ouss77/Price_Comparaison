const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

let scrapeOrbitz = async (hotel_name, city, check_in, check_out) => {
  console.time("scrapeOrbitz");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  //await page.setDefaultNavigationTimeout(60000);

  await page.goto(`https://www.orbitz.com/Hotel-Search?adults=2&children=&d1=${check_in}&d2=${check_out}&destination=Fes%20%28and%20vicinity%29%2C%20F%C3%A8s-Mekn%C3%A8s%2C%20Morocco&endDate=${check_out}&latLong=34.003295%2C-4.999299&mapBounds=&pwaDialog&regionId=6084753&rooms=1&semdtl=&sort=RECOMMENDED&startDate=${check_in}&theme=&useRewards=false&userIntent=`)
  await page.waitForTimeout(1000);
  
  await page.waitForSelector('.uitk-form-field-trigger');
  await page.click('.uitk-form-field-trigger');
  await page.waitForTimeout(1000);

  await page.keyboard.type(`${hotel_name} ${city}`);
  await page.waitForTimeout(2000);

  await page.click('[data-stid="destination_form_field-result-item-button"]');
  await page.waitForTimeout(2000);

  // await page.click('[data-testid="submit-button"]')
  // await page.waitForTimeout(4000);
  await page.waitForSelector('.uitk-text.uitk-type-end.uitk-type-200.uitk-text-default-theme');
  const result = await page.evaluate(() => {
    const priceElement = document.querySelectorAll('.uitk-text.uitk-type-end.uitk-type-200.uitk-text-default-theme')[0];
    if (priceElement) {
      const price = priceElement.innerText;
      console.log(price);
      return {price} ;
    } else {
      return "No place to reserve";
    }
  });
  
  browser.close();
  console.timeEnd("scrapeOrbitz");

  return result;
};
// scrape()
//   .then((value) => {
//     console.log(value);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
  module.exports.scrapeOrbitz = scrapeOrbitz;
