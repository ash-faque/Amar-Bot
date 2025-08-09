const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}`, {})
        .then(m => console.log(`[SUCCESS] Reply sented succesfully.`))
        .catch(e => console.error(`[ERROR] ${e.toString()}`));
});

bot.hears(/([^\s]+)/g, ctx => {
    bot.telegram.sendMessage(ctx.chat.id, `He he, ${ctx.message.text}`, {})
        .then(m => console.log(`[SUCCESS] Reply sented succesfully.`))
        .catch(e => console.error(`[ERROR] ${e.toString()}`));
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))