const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.bot_token);

const random_post = require('./random');

// Pressed /start 
bot.command('start', ctx => {
    console.log(`New start by: ${ctx.from.username}`);
    bot.telegram.sendMessage(ctx.chat.id, `
👋 HEY ${(ctx.from.first_name).toUpperCase()} ${(ctx.from.last_name).toUpperCase()} 👋

🤩 WELCOME TO TELE-DDIT BOT 🤩

Sent a subreddit name (r/ not needed)`, {})
        .then(m => console.log(`✔ Reply sented succesfully.`))
        .catch(e => console.log(`Error: ${e.toString()}`));
});

// Hear anything
bot.hears(/([^\s]+)/g, ctx => {
    let sub_reddit = ctx.message.text;
    if (sub_reddit.indexOf(' ') !== -1){
        let words = sub_reddit.split(' '), _sub_reddit = '';
        words.forEach(word => _sub_reddit += word);
        sub_reddit = _sub_reddit;
    };
    if(sub_reddit.startsWith('r/')) sub_reddit = sub_reddit.substring(2);
    random_post(sub_reddit, ctx)
        .then(r =>  console.log(r) )
        .catch(e =>  console.log(e) );
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Launch
bot.launch();

// App routes
app.get('/', (req, res) => {
    res.send('👋 Hello explorer. \nIts Teleddit here.')
});

app.listen(port, console.log(`🤓 Listening on port ${port}`));