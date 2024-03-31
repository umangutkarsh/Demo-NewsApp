import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ExecutorProps } from '../../definitions/ExecutorProps';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { DemoNewsApp } from '../../DemoNewsApp';
import { NewsSlashCommandContext } from '../NewsCommand';
import { sendMessage } from '../../lib/sendMessage';
import { buildNewsBlock, buildRSSNewsBlock } from '../../blocks/UtilityBlock';
// import * as Parser from 'rss-parser';
// const https = require('https');
import * as https from 'https';
import { NewsSetting } from '../../config/Settings';
import { Block } from '@rocket.chat/ui-kit';

export class CommandUtility implements ExecutorProps {
    context: SlashCommandContext;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persistence: IPersistence;
    app: DemoNewsApp;
    sender?: IUser;
    room?: IRoom;
    command?: string[];

    constructor(props: ExecutorProps) {
        this.context = props.context;
        this.read = props.read;
        this.modify = props.modify;
        this.http = props.http;
        this.persistence = props.persistence;
        this.app = props.app;
        this.sender = props.sender;
        this.room = props.room;
        this.command = props.command;
    }

    public async fetchNews({
        app,
        context,
        read,
        modify,
        http,
        persistence,
    }: NewsSlashCommandContext) {
        const room = context.getRoom();
        const sender = context.getSender();
        const appUser = (await read.getUserReader().getAppUser()) as IUser;

        const category = `general`;
        const language = `en`;
        const max_content = `5`;
        const query = `Technology`;
        // const apiKey = (await read.getEnvironmentReader().getSettings().getValueById(NewsSetting.API_KEY)) as string;
        const apiKey = `a23a2e02df0cd1192f391ee41e5a8fcc`;
        // a23a2e02df0cd1192f391ee41e5a8fcc

        const getTopHeadlinesEndpoint = () => `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&max=${max_content}&apikey=${apiKey}`;

        const getSearchEndpoint = () => `https://gnews.io/api/v4/search?q=${query}&lang=${language}&max=${max_content}&apikey=${apiKey}`;

        try {
            const response = await http.get(getSearchEndpoint());
            this.app.getLogger().info(response);
            console.log(response);

            var message = `News fetched`;
            // await sendMessage(modify, room, appUser, message);


            let news = response?.data?.articles;
            console.log('NewsLength: ', news.length);
            console.log('News: ', news);

            let allNewsBlocks: Array<Array<Block>> = [];

            for (let i=0 ; i<news.length ; i++) {

                const newsBlock = await buildNewsBlock(
                    i.toString(),
                    news[i].title,
                    news[i].description,
                    news[i].image,
                );
                allNewsBlocks.push(newsBlock);
            }
            await sendMessage(modify, room, appUser, message, allNewsBlocks);
            console.log('NEWS FETCHED');


        } catch (err) {
            this.app.getLogger().error(`Error while fetching news`);
            console.log(err);
        }
    }

    public async fetchNewsTechCrunch({
        app,
        context,
        read,
        modify,
        http,
        persistence,
    }: NewsSlashCommandContext) {
        app.getLogger().info(`Methhod techcrunch called`);
        console.log(`Methhod techcrunch called`);

        interface NewsItem {
            id: number;
            link: string;
            title: string;
            description: string;
            image_url: string;
        }

        const room = context.getRoom();
        const sender = context.getSender();
        const appUser = (await read.getUserReader().getAppUser()) as IUser;

        const techCrunchApi = () => `https://techcrunch.com/wp-json/wp/v2/posts`;

        let newsItems: NewsItem[] = [];
        try {
            const response = await http.get(techCrunchApi());
            // console.log('TechCrunch News: ', response.data);
            // app.getLogger().info(`TechCrunch News: `, response.data);

            newsItems = response.data?.map((news) => ({
                id: news.id,
                link: news.link,
                title: news.yoast_head_json.title,
                description: news.yoast_head_json.description,
                image_url: news.jetpack_featured_media_url
            })) || [];
            // console.log('Transformed news: ', newsItems);
            // app.getLogger().info('Transformed news: ', newsItems);

        } catch (err) {
            app.getLogger().info('Error while fetching news. ', err);
            console.log(err);
        }

        // const getLlama2Api = () => `https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-hf`;
        // const apiToken = `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`;
        // const getLlama2Payload = (prompt) => {
        //     const text = prompt;

        //     const payload = {
        //         headers: {
        //             "Authorization": `Bearer ${apiToken}`,
        //         },
        //         method: "POST",
        //         body: JSON.stringify(text),
        //     };

        //     return payload;
        // }

        // try {
        //     const llama2Response = await http.post(
        //         getLlama2Api(),
        //         getLlama2Payload({"inputs": "Who are you?"})
        //     );
        //     // const result = response;
        //     console.log('Llama2 Response: ', llama2Response);
        //     app.getLogger().info('Llama2 Response: ', llama2Response);
        // } catch (err) {
        //     console.log('Error generating llama2 response. ', err);
        //     app.getLogger().info('Error generating llama2 response. ', err);
        // }

        // const getMistralApi = () => `https://api.mistral.ai/v1/chat/completions`;
        // const getMistralPayload = (prompt) => {
        //     const newsDescription = prompt;
        //     const data = {
        //         model: "mistral-small-latest",
        //         messages: [
        //             {
        //                 role: "user",
        //                 content: newsDescription,
        //             },
        //         ],
        //     };
        //     const headers = {
        //         "Content-Type": "application/json",
        //     };

        //     return {data, headers};
        // };

        // try {
        //     const mistralResponse = await http.post(getMistralApi(), getMistralPayload(`Who are you?`));
        //     console.log('Mistral Response: ', mistralResponse);
        //     app.getLogger().info('Mistral Response: ', mistralResponse);

        // } catch (err) {
        //     console.log('Error generating mistral response. ', err);
        //     app.getLogger().info('Error generating mistral response. ', err);
        // }

        const getOpenAIApiChatCompletion = () => `https://api.openai.com/v1/chat/completions`;
        const openAIApiKey = `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`;
        const getOpenAIPayload = (newsContent) => {
            const newsCategories = `General, Business and Finance, Technology, Entertainment, Sports, Politics, Health, International, Investigative Journalism`;
            const prompt = `This news -> ${newsContent} falls under which category out of these -> ${newsCategories}, answer in one word`
            const data = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: prompt,
                    },
                ]
            }
            const headers = {
                'Content-Type': "application/json",
                "Authorization": `Bearer ${openAIApiKey}`,
            }

            return { headers, data };
        }

        let allNewsBlocks: Array<Array<Block>> = [];

        try {
            var message = `News fetched`;

            for (let i=newsItems.length-1 ; i>=newsItems.length-4 ; i--) {
                    const openAIResponse = await http.post(
                        getOpenAIApiChatCompletion(),
                        getOpenAIPayload(newsItems[i].description),
                    );
                    console.log(`News Description ${i}: `, newsItems[i].description);
                    app.getLogger().info(`News Description ${i}: `, newsItems[i].description);

                    console.log(`News category response ${i}: `, openAIResponse.content);
                    app.getLogger().info(`News category response ${i}: `, openAIResponse.content);

                    // await sendMessage(modify, room, appUser, message);

                    const newsBlock = await buildNewsBlock(
                        newsItems[i].title,
                        newsItems[i].description,
                        newsItems[i].link,
                        newsItems[i].image_url,
                    );
                    allNewsBlocks.push(newsBlock);


                    // const openAIResponse = await http.post(
                    //     getOpenAIApiChatCompletion(),
                    //     getOpenAIPayload('New'),
                    // );
                    // console.log('Chat response: ', openAIResponse);
                    // app.getLogger().info(openAIResponse)

                }
                await sendMessage(modify, room, appUser, message, allNewsBlocks);
        } catch (err) {
            console.log('Error generating OpenAI response ', err);
            app.getLogger().info('Error generating OpenAI response ', err);
        }

    }

    public async fetchNewsRSS({
        app,
        context,
        read,
        modify,
        http,
        persistence,
    }: NewsSlashCommandContext) {
        app.getLogger().info(`Methhod rss called`);
        console.log(`Method rss called`);


        // const rssParser = new Parser();
        // const feed = await rssParser.parseURL(`https://feeds.bbci.co.uk/news/science_and_environment/rss.xml`);
        // console.log('Feed: ', feed);
        // app.getLogger().info('Feed: ', feed);

        const room = context.getRoom();
        const sender = context.getSender();
        const appUser = (await read.getUserReader().getAppUser()) as IUser;

        interface RssItem {
            title: string,
            link: string,
            description: string,
            publishDate: string;
        }

        async function fetchRssFeed(url: string): Promise<RssItem[]> {
            try {
                const response = await new Promise<string>((resolve, reject) => {
                    https.get(url, (res) => {
                        let data = '';

                        res.on('data', (chunk) => {
                            data+=chunk;
                        });

                        res.on('end', () => {
                            resolve(data);
                        });

                        res.on('error', (err) => {
                            reject(err);
                        });
                    });
                });

                const items = parseRssItems(response);
                return items;
            } catch (error) {
                console.error('Error fetching RSS feed:', error);
                throw error;
            }
        }

        function parseRssItems(xml: string): RssItem[] {
            const items: RssItem[] = [];
            const itemRegex = /<item>([\s\S]*?)<\/item>/g;
            let match: RegExpExecArray | null;
            while ((match = itemRegex.exec(xml)) !== null) {
                const item = match[1];
                const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
                const linkMatch = item.match(/<link>(.*?)<\/link>/);
                const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
                const publishDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

                if (titleMatch && linkMatch && descriptionMatch && publishDateMatch) {
                    items.push({
                        title: titleMatch[1],
                        link: linkMatch[1],
                        description: descriptionMatch[1],
                        publishDate: publishDateMatch[1],
                    });
                }
            }
            return items;
        };

        const rssUrl = `https://feeds.bbci.co.uk/news/science_and_environment/rss.xml`;
        (async () => {
        try {
            const items = await fetchRssFeed(rssUrl);
            console.log('RSS-parsed: ', items);
            let allNewsBlocks: Array<Array<Block>> = [];

            for (let i=0 ; i<items.slice(0, 3).length ; i++) {

                const newsBlock = await buildRSSNewsBlock(
                    i.toString(),
                    items[i].title,
                    items[i].description,
                    items[i].link,
                )
                allNewsBlocks.push(newsBlock);
                app.getLogger().info(`Item ${i} fetched`);
            }
            await sendMessage(modify, room, appUser, 'Rss News fetched', allNewsBlocks);
        } catch (error) {
            console.error('Error processing RSS feed:', error);
        }
        })();

        app.getLogger().info(`Method rss fetched`);
        console.log(`Method rss fetched`);


    }

    public async scheduleNews({
        app,
        context,
        read,
        modify,
        http,
        persistence,
    }: NewsSlashCommandContext) {

        const task = {
            id: 'subscribe',
            interval: '5 seconds',
            data: {cron: await this.fetchNews({
                app,
                context,
                read,
                modify,
                http,
                persistence,
            })},
            skipImmediate: false,
        }
        console.log('SCHEDULED!!');

        const onceTask = {
            id: 'fetchNewsTask',
            when: '3 seconds',
            data: {
                context,
            },
        }
        // await modify.getScheduler().scheduleRecurring(task);
        await modify.getScheduler().scheduleOnce(onceTask);
        console.log('Fetched!!!!');

    }

    public async stopNews({
        app,
        context,
        read,
        modify,
        http,
        persistence,
    }: NewsSlashCommandContext) {
        const jobId = context.getArguments().join(' ');
        console.log(context.getArguments());

        console.log('JobId: ', jobId);

        console.log('Fetching stopped');

        await modify.getScheduler().cancelJob(jobId);
    }
}
