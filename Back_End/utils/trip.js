const puppeteer = require('puppeteer');
const fs = require('fs');
const { Parser } = require('json2csv');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.trip.com/hotels/list?city=809&cityName=Casablanca&provinceId=10719&countryId=71&districtId=0&checkin=2023/04/14&checkout=2023/04/15&barCurr=USD&searchType=CT&searchWord=Casablanca&searchValue=19%7C809_19_809_1&searchCoordinate=BAIDU_-1_-1_0|GAODE_-1_-1_0|GOOGLE_-1_-1_0|NORMAL_33.5333333_-7.5833333_0&crn=1&adult=2&children=0&searchBoxArg=t&travelPurpose=0&ctm_ref=ix_sb_dl&domestic=false&oldLocale=en-XX');
  //await page.waitForTimeout(3000);
  //await page.waitForSelector('uitk-heading-5'); // Wait for hotel titles to load

  const result = await page.evaluate(() => {
    let hotels = [];
    let titles = document.querySelectorAll('.name');
    let prices = document.querySelectorAll('.not-break');


    for (let i = 0; i < titles.length; i++) {
      let hotel = {
        title: titles[i].innerText,
        price: prices[i].innerText

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
    // fs.writeFileSync('./hotelsExpidia.csv', csv);
    console.log('CSV file has been created successfully!');
  })
  .catch((error) => {
    console.error(error);
  });
 