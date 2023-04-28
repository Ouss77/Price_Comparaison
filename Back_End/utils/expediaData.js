const puppeteer = require('puppeteer');
const fs = require('fs');
const { Parser } = require('json2csv');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  //if the page makes a  request to a resource type of image or stylesheet then abort that request
  page.on('request', request => {
    if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
      request.abort();
    else
      request.continue();
  });
  await page.goto('https://www.expedia.com/Hotel-Search?adults=2&children=&d1=2023-04-25&d2=2023-04-26&destination=Marrakech%2C%20Marrakech%2C%20Marrakech-Safi%2C%20Morocco&endDate=2023-04-26&latLong=31.6297%2C-7.987581&mapBounds=&pwaDialog&regionId=2938&rooms=1&semdtl=&sort=RECOMMENDED&startDate=2023-04-25&theme=&useRewards=false&userIntent=');
  
 
  const result = await page.evaluate(() => {
    let hotels = [];
    let titles = document.querySelectorAll('.uitk-heading-5');
    let prices = document.querySelectorAll('div.uitk-text.uitk-type-600.uitk-type-bold.uitk-text-emphasis-theme');


    for (let i = 0; i < titles.length; i++) {
      let hotel = {
        title: titles[i].innerText,
        price: prices[i].innerText

      };
      hotels.push(hotel);
    }

    return {hotels};
  });
browser.close()
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
