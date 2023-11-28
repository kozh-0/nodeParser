import axios from 'axios';
import { Loader } from '../loader';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

function LOG(msg) {
  console.log(`${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) - ${msg.text}`);
  console.log(new Date(msg.date * 1000).toLocaleString('ru'));
}

async function getAvitoData(str: string) {
  let [brand, model, transmission] = str.split(' ');
  brand = brand ?? '';
  model = model ?? '';
  transmission = transmission ?? '';

  return await axios.post('http://localhost:5555/cars/getList', { brand, model }).then((res) => res.data);
}

const TG_BOT = new Telegraf(process.env.TG_KEY, { handlerTimeout: Infinity });

TG_BOT.command('start', (ctx) => {
  console.log('Начало ТГ в терминале');

  ctx.reply(`Добро пожаловать, выбирай корыто...
  
  Вбивай параметры через пробел на английском (Subaru forester механика или автомат)

  Не иначе...
  `);
});

TG_BOT.on(message('text'), async (ctx) => {
  const text = ctx.message.text.trim();
  if (!text) return;

  const loader = new Loader(ctx);
  loader.show();

  console.log(ctx.message.text);

  const kek = await getAvitoData(ctx.message.text);
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', kek);

  ctx.reply(JSON.stringify(kek));
  loader.hide();
});

export { TG_BOT };
