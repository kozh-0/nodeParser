import dedent from 'dedent';
import { Loader } from './loader';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { getCarDataFromAvito } from '../lib/parser';

function LOG(msg) {
  console.log(dedent`========================================================================================
  ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) - ${msg.text}
  ${new Date(msg.date * 1000).toLocaleString('ru')}
  `);
}

const TG_BOT = new Telegraf(process.env.TG_KEY, { handlerTimeout: 30000 });

TG_BOT.command('start', (ctx) => {
  ctx.reply(`Добро пожаловать, выбирай корыто...
  Бот ищет любую машину на любом языке`);
});

TG_BOT.on(message('text'), async (ctx) => {
  const input = ctx.message.text.trim().replaceAll(' ', '+');
  if (!input) return;

  const loader = new Loader(ctx);
  loader.show();

  LOG(ctx.message);

  try {
    const kek = await getCarDataFromAvito({ input });
    console.log('Успех \n');

    // Порой возникает краш где-то тут, TelegramError: 400: Bad Request: not Foun
    loader.hide();
    if (kek.status === 500) return ctx.reply(`Что-то пошло не так...`);
    if (kek.status === 404) return ctx.reply('Ничего не найдено');

    kek.list.forEach((el) => {
      ctx.reply(dedent`${el.title}
        ${el.info}
        ${el.price} — ${el.publishDate}
        ${el.link}`);
    });
  } catch (err) {
    console.error('TRY_CATCH AREA===========================================', err);
    // Пока сюда не попадал, возможно try catch не нужен
    console.error(err);

    ctx.reply(`Что-то пошло cооовсем не так...`);
  }
});

TG_BOT.catch((err, ctx) => {
  console.error(err);
  ctx.reply('Ошибка тг! Попробуй еще раз...');
});

export { TG_BOT };
