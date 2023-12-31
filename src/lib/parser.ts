import puppeteer from 'puppeteer';

// Данная функция используется ТГ ботом и Апи напрямую
export async function getCarDataFromAvito(reqBody: { input: string; sortByPrice?: boolean }) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // сортировка по цене (s=104), радиус 100, вначале стоит город
  const avitoCarUrl = `https://www.avito.ru/ufa/avtomobili?q=${reqBody.input}&radius=100&searchRadius=100&s=104`;
  console.log(avitoCarUrl);
  // ТУТ ОШИБКА!!!! Не может открыть страницу, waitUntill хз поможет ли
  await page.goto(avitoCarUrl, { timeout: 30000, waitUntil: 'networkidle2' });
  // ТУТ ОШИБКА!!!! ^^^^^^^^^^^^^^^^ Скорректировать с таймаутами апи и телеги там тоже по 30 сек
  console.log('Открыл страницу, обрабатываю...');

  const data = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('div[data-marker=item]'), (el, id) => {
      if (id > 5) return null;
      return {
        title: el.querySelector('h3').innerText, // @ts-ignore
        info: el.querySelector('p[data-marker=item-specific-params]').innerText,
        price: el.querySelector('p').innerText, // @ts-ignore
        publishDate: el.querySelector('div[data-marker="item-date/tooltip/reference"]').innerText,
        link: el.querySelector('a').href,
        id: id + 1,
      };
    }).slice(0, 5);

    return { list, status: 200, error: '' };
  });

  browser.close();

  if (!data.list.length) {
    console.log('404 Ошибка?');
    return { ...data, error: 'Не удалось ничего найти...', status: 404 };
  }

  if (reqBody.sortByPrice) {
    // Тут обязательно не пробел, а спецсимвол, иначе не будет работать сортировка по цене
    data.list.sort((a, b) => (parseInt(a.price.replaceAll(' ', '')) > parseInt(b.price.replaceAll(' ', '')) ? 1 : -1));
  }

  return data;
}
