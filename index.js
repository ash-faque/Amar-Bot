const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const bot = new Telegraf(process.env.BOT_TOKEN);

async function ask_ai(__input = "Hello there") {
    try {
        __input = `You are an automotive software engineer & were asked "${__input}".
        Respond in Gen-Z techy slang, but no formatting, just plain text.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: __input
        });
        return response.text;
    } catch (error) {
        return "Couldn't communicate with Gemini API.";
    }
}

bot.hears(/([^\s]+)/g, ctx => {
    __text = ctx.message.text || 'hi';
    if (!__text.toLowerCase().includes(process.env.BOT_NAME)) return;
    ask_ai(__text).then(response => {
        bot.telegram.sendMessage(ctx.chat.id, response, {})
            .then(r => console.log(`[SUCCESS] Reply sent to ${ctx.from.first_name} for '${__text}'`))
            .catch(e => console.error(`[ERROR] ${e.toString()}`));
    });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
