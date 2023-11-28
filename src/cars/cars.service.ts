import puppeteer from 'puppeteer';

interface getCarListInterface {
  brand: string;
  model: string;
  transmission: 'mehanika' | 'avtomat';
  sortByPrice: boolean;
}

export async function getCarDataFromAvito(reqBody: getCarListInterface) {
  const start = performance.now();
  console.log('START', reqBody);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // сортировка по цене (s=104), радиус 100, вначале стоит город
  const avitoCarUrl = `https://www.avito.ru/ufa/avtomobili/${reqBody.brand}/${reqBody.model}${
    reqBody.transmission ? `/${reqBody.transmission}` : ''
  }?radius=100&searchRadius=100&s=104`;
  console.log(avitoCarUrl);
  //   await page.setViewport({ width: 1080, height: 1024 });
  //   await page.screenshot({ path: "img.png" });

  await page.goto(avitoCarUrl);
  console.log('Обработка данных... ', performance.now() - start);

  const data = await page.evaluate(() => ({
    list: Array.from(document.querySelectorAll('div[data-marker=item]'), (el, id) => ({
      title: el.querySelector('h3').innerText, //@ts-ignore
      info: el.querySelector('p[data-marker=item-specific-params]').innerText,
      price: el.querySelector('p').innerText, //@ts-ignore
      publishDate: el.querySelector('div[data-marker="item-date/tooltip/reference"]').innerText,
      link: el.querySelector('a').href,
      id: id + 1,
    })),
    status: 200,
    error: '',
  }));

  browser.close();

  if (!data.list.length) {
    data.error = 'Не удалось ничего найти...';
    data.status = 404;
    return data;
  }

  if (reqBody.sortByPrice) {
    // Тут обязательно не пробел, а спецсимвол, иначе не будет работать сортировка по цене
    data.list.sort((a, b) => (parseInt(a.price.replaceAll(' ', '')) > parseInt(b.price.replaceAll(' ', '')) ? 1 : -1));
  }

  return data;
}
