const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

function convertDate(inputDateStr) {
  let inputDate = new Date(inputDateStr);
  let weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let weekdayName = weekdayNames[inputDate.getDay()];
  let monthName = monthNames[inputDate.getMonth()];
  return `${weekdayName}, ${inputDate.getDate()} ${monthName}`;
}

let scrapeGoogle = async (hotel_name, check_in, check_out) => {
  console.log("I am scraping from Google");
  console.log("the hotel name is ", hotel_name);
  console.time("scrapeGoogle");
  const browser = await puppeteer.launch({
    headless: true,
    //userDataDir: "/scrape",
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  d1 = convertDate(check_in);
  d2 = convertDate(check_out);
  console.log("the new date format is ", d1);
  console.log("the new date format is ", d2);
  await page.goto(
    "https://www.google.com/travel/search?ts=CAESCgoCCAMKAggDEAAaOAoaEhYKCC9tLzAyMmJfOgpDYXNhYmxhbmNhGgASGhIUCgcI5w8QBRgQEgcI5w8QBRgRGAEyAggBKgkKBToDTUFEGgA&ved=0CAAQ5JsGahgKEwiAqMy1p8f-AhUAAAAAHQAAAAAQnwQ&ictx=3&hl=en-MA&gl=ma&tcfs=EjAKCC9tLzAyMmJfEgpDYXNhYmxhbmNhGhgKCjIwMjMtMDUtMTYSCjIwMjMtMDUtMTcYAlIA&g2lb=2502548%2C2503771%2C2503781%2C4258168%2C4270442%2C4284970%2C4291517%2C4306835%2C4308226%2C4597339%2C4757164%2C4814050%2C4850738%2C4864715%2C4874190%2C4886480%2C4893075%2C4920132%2C4924070%2C4936396%2C4965990%2C4968087%2C4972345%2C4991446%2C72248525%2C72251324&ap=KigKEgkb6j59Gb9AQBEBk3b-w_UewBISCSdqFzfl1kBAEQGTdv7Ngh7AMAA&qs=CAEyJ0Noa0k3LUxZanVtX3FMUWJHZzB2Wnk4eE1YTnRlWEIwZDNjekVBRTgNSAA"
  );
  await page.waitForTimeout(1000);
  await page.waitForSelector(".II2One.j0Ppje.zmMKJ.LbIaRd");
  await page.click(".II2One.j0Ppje ");
  await page.waitForTimeout(1000);

  await page.keyboard.type(`${hotel_name}`);
  await page.waitForSelector(".Q1RWxd");

  await page.click(".Q1RWxd");
  await page.waitForTimeout(2000);

  //>>>>>>>> choosing date from the calender
  await page.click(".TP4Lpb.eoY5cb.j0Ppje");
  await page.waitForTimeout(2000);

  const dt1 = await page.$(`.eoY5cb.CylAxb.sLG56c.yCya5[aria-label="${d1}"]`);
  console.log("the value of date that you are searching is ", dt1);
  await dt1.click();

  const dt2 = await page.$(`.eoY5cb.CylAxb.sLG56c.yCya5[aria-label="${d2}"]`);
  await dt2.click();
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    var button = document.querySelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.z18xM.rtW97.Q74FEc.Tq8g8b");
    button.click();
  });
  
  await page.waitForTimeout(2000);
  const result1 = await page.evaluate(() => {
    const titles = document.querySelectorAll(".FjC1We");
    const prices = document.querySelectorAll(".pNExyb");    
    const data = [];
    for (let i = 0; i < 4; i++) {
      data.push({
        title: titles[i].innerText,
        price: prices[i].innerText,
      });
    }
    return data;
  });

  console.timeEnd("scrapeGoogle");
  return result1;
};

// scrapeGoogle()
//   .then((value) => {
//     console.log(value);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
module.exports.scrapeGoogle = scrapeGoogle;
