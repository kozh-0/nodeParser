import { readFileSync } from "fs";
import doSomething from "./modules/kek.js";

const fileContent = readFileSync("./lmfao.txt", "utf-8");
// fs.writeFileSync("test.txt", "some text");
console.log(fileContent);
// doSomething();

import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const avitoForesterManualDoLyama =
    "https://www.avito.ru/all/avtomobili/subaru/forester/mehanika-ASgBAQICAkTgtg2mmSjitg3MpSgBQPC2DRTstyg?cd=1&f=ASgBAQECAkTgtg2mmSjitg3MpSgBQPC2DRTstygBRcaaDBx7ImZyb20iOjQwMDAwMCwidG8iOjEwMDAwMDB9";
  await page.goto(avitoForesterManualDoLyama);
  //   await page.setViewport({ width: 1080, height: 1024 });
  //   await page.screenshot({ path: "img.png" });

  let res = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div[data-marker=item]"), (el, id) => ({
      title: el.querySelector("h3").innerText,
      price: el.querySelector("p").innerText,
      //@ts-ignore
      link: el.querySelector("a").attributes.href.baseUri,
      id: id + 1,
    })).sort((a, b) => (a.price > b.price ? 1 : -1));
  });

  console.log(res);

  await browser.close();
})();
