import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { DemoNewsApp } from '../DemoNewsApp';
import { NewsItem } from '../definitions/NewsItem';
import { NewsSource } from '../definitions/NewsSource';
import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { buildRSSNewsBlock } from '../blocks/UtilityBlock';
import { sendMessage } from '../lib/sendMessage';
import * as https from 'https';


interface RssItem {
    id: string,
    title: string,
    description: string,
    link: string,
    publishDate: string,
    image: string;
}

function parseRssItems(xml: string): RssItem[] {
    const items: RssItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;
    let id = 1;

    while ((match = itemRegex.exec(xml)) !== null) {
        const item = match[1];
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const publishDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
        const imageMatch = item.match(/<media:thumbnail[^>]*url="(.*?)"/);

        if (titleMatch && linkMatch && descriptionMatch && publishDateMatch && imageMatch) {
            items.push({
                id: id.toString(),
                title: titleMatch[1],
                description: descriptionMatch[1],
                link: linkMatch[1],
                publishDate: publishDateMatch[1],
                image: imageMatch[1],
            });
            id++;
        }
    }
    return items;
};

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

export class BBCNewsSource extends NewsSource {
    news: NewsItem[] = [];
    fetchUrl = `https://feeds.bbci.co.uk/news/science_and_environment/rss.xml`;

    public async fetchNews(
        app: DemoNewsApp,
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence,
        filter?: {}
    ): Promise<void> {

        (async () => {
        try {
            const items = await fetchRssFeed(this.fetchUrl);
            console.log(items);
        } catch (error) {
            console.error('Error processing RSS feed:', error);
        }
        })();
    }
}
