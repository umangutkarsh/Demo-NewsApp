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
        const apiKey = `a23a2e02df0cd1192f391ee41e5a8fcc`;

        const getTopHeadlinesEndpoint = () => `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&max=${max_content}&apikey=${apiKey}`;

        const getSearchEndpoint = () => `https://gnews.io/api/v4/search?q=${query}&lang=${language}&max=${max_content}&apikey=${apiKey}`;

        try {
            const response = await http.get(getSearchEndpoint());
            this.app.getLogger().info(response);
            console.log(response);

            var message = `News fetched`;
            await sendMessage(modify, room, appUser, message);

            let news = response?.data?.articles;

            for (let i=0 ; i<news.length ; i++) {

                const newsBlock = await buildNewsBlock(
                    i.toString(),
                    news[i].title,
                    news[i].description,
                    news[i].image,
                )
                await sendMessage(modify, room, appUser, message, newsBlock);
            }

        } catch (err) {
            this.app.getLogger().error(`Error while fetching news`);
            console.log(err);
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
            // This is a very basic parser and might not work for all RSS feeds
            // You might need to adjust it based on the specific structure of the RSS feed you're parsing
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

            for (let i=0 ; i<items.slice(0, 3).length ; i++) {

                const newsBlock = await buildRSSNewsBlock(
                    i.toString(),
                    items[i].title,
                    items[i].description,
                    items[i].link,
                )
                app.getLogger().info(`Item ${i} fetched`);
                await sendMessage(modify, room, appUser, 'Rss News fetched', newsBlock);
            }
            // Here you can process the items, e.g., send them as a message in Rocket.Chat
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