import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { NewsSource } from '../definitions/NewsSource';
import { NewsItem } from '../definitions/NewsItem';
import { DemoNewsApp } from '../DemoNewsApp';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';
import { buildNewsBlock } from '../blocks/UtilityBlock';
import { sendMessage } from '../lib/sendMessage';

export class TechCrunchNewsSource extends NewsSource {
    fetchUrl = `https://techcrunch.com/wp-json/wp/v2/posts`;

    constructor(config) {
        super(config);
    }

    public async fetchNews(
        app: DemoNewsApp,
        filter?: {}
        ...other_params,
    ): Promise<void> {
        // logic to fetch news and store in NewsItem format
    }

    static async detemineCategory(newsItem: NewsItem, http: IHttp) {
        return Promise.all(newsItem.categories.map(async categoryId => {
            const response = await http.get(`https://techcrunch.com/wp-json/wp/v2/categories/${categoryId}`);
            return response?.name; // will return the category in string format.
        }));
    }
}
