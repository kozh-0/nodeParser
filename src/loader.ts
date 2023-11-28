import { Message, Update } from '@telegraf/types';
import { Context, NarrowedContext } from 'telegraf';

export class Loader {
  icons = ['🕛', '🕑', '🕒', '🕓', '🕕', '🕗', '🕘'];
  message = null;
  interval = null;
  ctx = null;

  constructor(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate>) {
    this.ctx = ctx;
  }

  async show() {
    let idx = 0;
    this.message = await this.ctx.reply(this.icons[idx]);
    this.interval = setInterval(() => {
      idx = idx < this.icons.length - 1 ? idx + 1 : 0;

      this.ctx.telegram.editMessageText(this.ctx.chat.id, this.message.message_id, null, this.icons[idx]);
    }, 500);
  }
  hide() {
    clearInterval(this.interval);
    this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id);
  }
}
