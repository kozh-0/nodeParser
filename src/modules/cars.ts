import express from 'express';
import puppeteer from 'puppeteer';

export const carsRouter = express.Router();

interface getCarListInterface {
  brand: string;
  model: string;
  transmission: 'mehanika' | 'avtomat';
  sortByPrice: boolean;
}

carsRouter.post('/getList', async (req, res) => {
  const start = performance.now();
  const reqData: getCarListInterface = req.body;
  console.log('START', reqData);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const avitoCarUrl = `https://www.avito.ru/ufa/avtomobili/${reqData.brand}/${reqData.model}${
    reqData.transmission ? `/${reqData.transmission}` : ''
  }?radius=100&searchRadius=100`;
  console.log(avitoCarUrl);
  await page.goto(avitoCarUrl);
  //   await page.setViewport({ width: 1080, height: 1024 });
  //   await page.screenshot({ path: "img.png" });

  console.log('Обработка данных... ', performance.now() - start);
  let data = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('div[data-marker=item]'), (el, id) => ({
      title: el.querySelector('h3').innerText, //@ts-ignore
      info: el.querySelector('p[data-marker=item-specific-params]').innerText,
      price: el.querySelector('p').innerText, //@ts-ignore
      link: el.querySelector('a').attributes.href.baseUri,
      id: id + 1,
    }));
    console.log(list);

    return { list: list, error: '' };
  });

  if (!data.list.length) {
    data.error = 'Не удалось ничего найти...';
    browser.close();
    res.status(404).send(data);
    return;
  }

  if (reqData.sortByPrice) {
    data.list.sort((a, b) => (parseInt(a.price.replaceAll(' ', '')) > parseInt(b.price.replaceAll(' ', '')) ? 1 : -1));
  }

  browser.close();
  res.json(data);
});
