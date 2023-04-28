const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

let scrapeHotels = async (hotel_name, cityName, check_in, check_out) => {
  console.time("scrapeHotels");
  const browser = await puppeteer.launch({
    headless: false,
    //userDataDir: "/scrape",
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await puppeteer.launch({slowMo: 1000})
  await page.goto(
    `https://fr.hotels.com/Hotel-Search?adults=2&children=&d1=2023-04-26&d2=2023-04-27&destination=F%C3%A8s%2C%20F%C3%A8s-Mekn%C3%A8s%2C%20Maroc&endDate=${check_out}&latLong=34.04608%2C-5.00386&locale=fr_FR&mapBounds=&pos=HCOM_FR&pwaDialog&regionId=181312&selected=564677&semdtl=&siteid=300000010&sort=RECOMMENDED&startDate=${check_in}&theme=&useRewards=false&userIntent=`
  );
  await page.waitForTimeout(3000);
  await page.click(".uitk-fake-input");

  //await page.click('[data-stid="destination_form_field-menu-trigger"]')
  await page.waitForTimeout(1000);
  //await page.click(".uitk-fake-input");

  //await page.keyboard.type('ibis casablanca');
  await page.keyboard.type(`${hotel_name} ${cityName}` );
  await page.waitForTimeout(2000);

  // Click on the first suggested item
  await page.click(".uitk-action-list-item-relaxed:first-child");

  // Click on the search button
  //await page.click('#search_button');
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const priceElement = document.querySelector("div.uitk-text.uitk-type-600.uitk-type-bold.uitk-text-emphasis-theme");
    if (priceElement) {
      const price = priceElement.innerText;
      console.log(price);
      return {price};
    } else {
      return "No place to reserve";
    }
  });
 // browser.close();
  console.timeEnd("scrapeHotels");

  return result;
};


// scrapeHotels()
//   .then((value) => {
//     console.log(value);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports.scrapeHotels = scrapeHotels;
