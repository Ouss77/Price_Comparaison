const puppeteer = require("puppeteer-extra");

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false,    defaultViewport: null,
  });
  const page = await browser.newPage();
  

  await page.goto('https://www.kayak.com/stays');
  
  await page.waitForSelector('.k_my-input');
  await page.focus('.k_my-input');
  await page.keyboard.type('ibis casablanca');
  await page.waitForTimeout(2000)
  
  await page.waitForSelector('.HPw7-submit');
  await page.click('.HPw7-submit');
  
  const newPageTarget = await browser.waitForTarget(target => target.opener() === page.target());
  const newPage = await newPageTarget.page();

  const check_in = '2023-05-20';
  const check_out = '2023-05-29';

  // await newPage.goto(updatedUrl);

  await newPage.waitForNavigation();
  await newPage.goto(newPage.url().split('/').slice(0,5).join('/')+"/"+check_in+"/"+check_out+"/2adults?sort=rank_a");
  await newPage.waitForNavigation();

    
  await newPage.waitForSelector('.zV27-price');

  const price = await newPage.evaluate(() => {
    
    const priceElement = document.querySelector('.zV27-price').innerText;
    console.log(priceElement);
    return priceElement;
  });

  console.log('Price:', price);
  return price;
};

scrape()
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });
