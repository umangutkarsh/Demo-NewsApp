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
    news: NewsItem[] = [];
    fetchUrl = `https://techcrunch.com/wp-json/wp/v2/posts`;

    constructor(config) {
        super(config);
    }

    public async fetchNews(
        app: DemoNewsApp,
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence,
        filter?: {}
    ): Promise<void> {
        try {
            const response = await http.get(this.fetchUrl);
            app.getLogger().info(response);
            console.log(response);

            let news = response?.data;
            console.log('News: ', news);

        } catch (err) {
            app.getLogger().error(`Error while fetching news`);
            console.log(err);
        }
    }

    static determineCategory(newsItem: NewsItem) {

    }
}
