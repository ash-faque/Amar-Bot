const axios = require('axios');
module.exports = (sub_reddit = 'memes', ctx) => {
    console.log(`🤖 Choosing random post from: ${sub_reddit}`);
    let URL = `https://www.reddit.com/r/${sub_reddit}/random.json`;
    return new Promise((resolve, reject) => {
        axios.get(URL)
            .then(res => {

                if (res.data[0]){
                    
                    let post = res.data[0].data.children[0].data,
                        subreddit = post.subreddit,
                        title = post.title,
                        selftext = post.selftext,
                        permalink = post.permalink,
                        thumbnail = post.thumbnail,
                        over_18 = post.over_18,
                        author = post.author,
                        url = post.url,
                        _url =  '',
                        msg = `
${over_18 ? '🔞 ' : '✍ '}${title}
\n----------------------------------------------------------\n
${selftext}
\n----------------------------------------------------------\n
https://reddit.com/${permalink}
https://reddit.com/r/${subreddit}
https://reddit.com/u/${author}
\n-----------------------------------------------------------\n`;

                    if (url.endsWith('.jpg') || url.endsWith('.png')){
                        _url = url;
                    } else if (thumbnail.endsWith('.jpg') || thumbnail.endsWith('.png')){
                        _url = thumbnail;
                    };

                    try {

                        let chunk_ln = 3693, chunks = [];

                        for (let i = 0; i <= msg.length; i += chunk_ln) chunks.push(msg.slice(i, (i +  chunk_ln)));

                        chunks.forEach(async chunk => {
                            let chunk_no = (chunks.indexOf(chunk) + 1);
                            try {
                                await ctx.reply(`${(msg.length > chunk_ln) ? `💠 PART: ${chunk_no}\n\n` : ``}\n${chunk}`);
                                if (msg.length > chunk_ln) console.log(`◾ Another chunk delivered.`);
                            } catch(e) {
                                console.log(`❌ Error on sending ${chunk_no}th part of message. \n` + e);
                                ctx.reply(`❌ Error on delivering ${chunk_no}th part of message. \n` + e)
                                    .then(r => console.log(' ❗ Error sented succesfully.'))
                                    .catch(e => console.log(`❌ Error on sending message. \n` + e));
                            };
                        });

                        if (_url != ''){
                            ctx.replyWithPhoto({ url: _url })
                                .then(m => {
                                    console.log('✅ Photo sented succesfully.');
                                }).catch(e => {
                                    ctx.reply('❌ Error on delivering photo.\n' + e)
                                            .then(r => console.log(' ❗ Error sented succesfully.'))
                                            .catch(e => console.log('❌ ' + e));
                                    reject('❌ Error on delivering photo.\n' + e);
                                });
                        };
        
                        resolve('✅ Messages sented succesfully.');

                    } catch (e){

                        reject('❌ Error on message delivery.\n' + e);

                    };

                } else {
                    
                    let msg = `❌ Cant find that one subreddit.\n🔍 Check what you typed by going to: \nhttps://www.reddit.com/subreddits/search?q=${sub_reddit}`;
                    console.log(msg);
                    ctx.reply(msg)
                            .then(r => console.log(' ❗ Error sented succesfully.'))
                            .catch(e => console.log('❌ \n' + e));
                    reject(msg);
                    
                };

            }).catch(e => {
                ctx.reply('❌ \n' + e)
                        .then(r => console.log(' ❗ Fetch error sented succesfully.'))
                        .catch(e => console.log('❌ \n' + e));
                reject('❌ Fetch error.\n' + e);
            });

    });
};