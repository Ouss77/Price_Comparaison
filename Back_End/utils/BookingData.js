const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs');
const { Parser } = require('json2csv');

let scrapeBooking = async (CITY_NAME, CHECK_IN_DATE, CHECK_OUT_DATE) => {
  const browser = await puppeteer.launch({ headless: true
}); // set headless to true
  const page = await browser.newPage();
 const url = `https://www.booking.com/searchresults.html?ss=${CITY_NAME}&checkin=${CHECK_IN_DATE}&checkout=${CHECK_OUT_DATE}&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure&nflt=ht_id%3D204`
  
await page.goto(url);
  await page.waitForTimeout(1000);

  const result = await page.evaluate(() => {
    let hotels = [];
    let titles = document.querySelectorAll('.a23c043802');
    let images = document.querySelectorAll('.b8b0793b0e');
    let prices = document.querySelectorAll('.e729ed5ab6');
    let urls = document.querySelectorAll('.e13098a59f');

    for (let i = 0; i < titles.length; i++) {
      let hotel = {
        title: titles[i].innerText,
        image: images[i].getAttribute('src'),
        price: prices[i].innerText,
        url: urls[i].getAttribute('href')
      };
      hotels.push(hotel)
    }
    return hotels
  });

  return result;
};

// scrapeBooking()
//   .then((value) => {
//     console.log(value);
//     const fields = ['title', 'image', 'price','url'];
//     const opts = { fields };
//     const parser = new Parser(opts);
//     const csv = parser.parse(value);
//     fs.writeFileSync('./hotels.csv', csv);
//     console.log('CSV file has been created successfully!');
//     return value
//   })
//   .catch((error) => {
//     console.error(error);
//   });
module.exports.scrapeBooking = scrapeBooking
