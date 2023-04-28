const puppeteer = require('puppeteer');
const fs = require('fs');
const { Parser } = require('json2csv');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.hotels.com/Hotel-Search?adults=2&d1=2023-04-26&d2=2023-04-27&destination=Taghazout%2C%20Souss-Massa%2C%20Morocco&endDate=2023-04-27&latLong=30.545338%2C-9.708985&regionId=6153242&selected=&semdtl=&sort=RECOMMENDED&startDate=2023-04-26&theme=&useRewards=false&userIntent=');
  await page.waitForTimeout(2000);
  //await page.waitForSelector('uitk-heading-5'); // Wait for hotel titles to load

  const result = await page.evaluate(() => {
    let hotels = [];
    let titles = document.querySelectorAll('.uitk-heading-5');
    let prices = document.querySelectorAll('div.uitk-text.uitk-type-600.uitk-type-bold.uitk-text-emphasis-theme');


    for (let i = 0; i < titles.length; i++) {
        let price = prices[i] ? prices[i].innerText : 'N/A'; // Check if price element exists, otherwise set to 'N/A'
        let hotel = {
          title: titles[i].innerText,
          price: price

      };
      hotels.push(hotel);
    }

    return {hotels};
  });

  browser.close();
  return result;
};

scrape()
  .then((value) => {
    console.log(value);
    const fields = ['title',  'price'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(value);
    fs.writeFileSync('./hotelsExpidia.csv', csv);
    console.log('CSV file has been created successfully!');
  })
  .catch((error) => {
    console.error(error);
  });
