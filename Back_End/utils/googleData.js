const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const URL = "https://www.google.com/travel/search?qs=OAA"
async function getHotelsInfo(page) {
  let lastHeight = await page.evaluate(`document.querySelector(".zQTmif").scrollHeight`);
  while (true) {
    await page.waitForTimeout(500);
    await page.keyboard.press("End");
    await page.waitForTimeout(500);
    await page.keyboard.press("PageUp");
    await page.waitForTimeout(5000);
    let newHeight = await page.evaluate(`document.querySelector(".zQTmif").scrollHeight`);
    if (newHeight === lastHeight) {
      break;
    }
    lastHeight = newHeight;
  }
  return await page.evaluate(() =>
    Array.from(document.querySelectorAll(".TNNk1.nzwZbc")).map((el) => {
      const adFrom = el.querySelector(".hVE5 .ogfYpf")?.textContent.trim();
      return {
        link: `https://www.google.com/${el.querySelector(".PVOOXe")?.getAttribute("href")}`,
        images: Array.from(el.querySelectorAll(".pb2I5 img"))
          .map((el) => el.getAttribute("src"))
          .filter((el) => el),
        title: el.querySelector(".BgYkof")?.textContent.trim(),
        price: el.querySelector(".xquSSe .kixHKb > span:first-child")?.textContent.trim(),
        rating: parseFloat(el.querySelector(".KFi5wf")?.textContent.trim()) || "No rating",
        reviews:
          parseInt(
            el
              .querySelector(".jdzyld")
              ?.textContent.trim()
              .replace(/[\(|\)|\s]/gm, "")
          ) || "No reviews",
        stars: parseInt(el.querySelector(".UqrZme")?.textContent.trim()),
        options: Array.from(el.querySelectorAll(".XX3dkb > .LtjZ2d ")).map((el) => el.textContent.trim()),
        adFrom,
      };
    })
  );
}
async function getHotelsResults() {
  const browser = await puppeteer.launch({
    headless: true, // if you want to see what the browser is doing, you need to change this option to "false"
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);
  //await page.waitForSelector(".TNNk1.nzwZbc");
  const hotels = await getHotelsInfo(page);
  await browser.close();
  return hotels;
}
getHotelsResults().then(console.log);