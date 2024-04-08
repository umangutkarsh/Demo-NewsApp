import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../definitions/NewsItem';
import { DemoNewsApp } from '../DemoNewsApp';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { buildNewsBlock } from '../blocks/UtilityBlock';
import { sendMessage } from '../lib/sendMessage';
import { NewsSource } from '../definitions/NewsSource';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

// export class TechCrunchNewsSource extends NewsSource {
//     fetchUrl = `https://techcrunch.com/wp-json/wp/v2/posts`;

//     constructor(config) {
//         super(config);
//     }

//     public async fetchNews(
//         app: DemoNewsApp,
//         filter?: {}
//         ...other_params,
//     ): Promise<void> {
//         // logic to fetch news and store in NewsItem format
//     }

//     static async detemineCategory(newsItem: NewsItem, http: IHttp) {
//         return Promise.all(newsItem.categories.map(async categoryId => {
//             const response = await http.get(`https://techcrunch.com/wp-json/wp/v2/categories/${categoryId}`);
//             return response?.name; // will return the category in string format.
//         }));
//     }
// }

export class TechCrunchNewsSource {
    app: DemoNewsApp;
    newsItems: NewsItem[] = [];
    fetchUrl = `https://techcrunch.com/wp-json/wp/v2/posts`;

    constructor(app: DemoNewsApp) {
        // super(app);
        this.app = app;
    }

    public async fetchNews(read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<NewsItem[]> {
        try {
            const response = await http.get(this.fetchUrl);
            console.log(response);
            this.newsItems = response?.data?.map((news) => ({
                id: news.id,
                title: news.yoast_head_json.title,
                description: news.yoast_head_json.description,
                link: news.link,
                image: news.jetpack_featured_media_url,
                source: 'TechCrunch',
                author: news.yoast_head_json.author,
                publishedAt: new Date(news.date),
            }))?.slice(0, 3);

            this.app.getLogger().info(this.newsItems);
        } catch (err) {
            console.log('Error', err);
            this.app.getLogger().info('Error', err);
        }

        return this.newsItems;
    }

    // public async saveNews(read: IRead, modify: IModify, http: IHttp, persis: IPersistence, id: string): Promise<void> {
    //     const techCrunchNews = this.fetchNews(read, modify, http, persis);

    //     const associations: Array<RocketChatAssociationRecord> = [
    //         new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'news'),
    //         // new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, ),
    //         new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id),
    //     ];

    //     try {
    //         await persis.updateByAssociations(associations, {id}, true);
    //     } catch (err) {
    //         console.log('Could not store news', err);
    //         this.app.getLogger().info('Could not store news', err);
    //     }

    // }

    public async displayNews(read: IRead, modify: IModify, http: IHttp, room: IRoom, persis: IPersistence) {
        const appUser = (await read.getUserReader().getAppUser()) as IUser;
        const techCrunchNews = await this.fetchNews(read, modify, http, persis);
        let allNewsBlocks: Array<Array<Block>> = [];

        for (let i=0 ; i<techCrunchNews.length ; i++) {
            const newsBlock = await buildNewsBlock(
                techCrunchNews[i].title,
                techCrunchNews[i].description,
                techCrunchNews[i].link,
                techCrunchNews[i].image,
            );
            allNewsBlocks.push(newsBlock)

        }
        await sendMessage(modify, room, appUser, 'News fetched', allNewsBlocks);
    }


}
