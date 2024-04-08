import { IHttp, IModify, IPersistence, IPersistenceRead, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from './NewsItem';
import { DemoNewsApp } from '../DemoNewsApp';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

// export class NewsSource {
//     config;
//     news: NewsItem[] = [];
//     constructor(config, ...other_params) {
//         this.config = config;
//     }

//     async fetchNews(
//         app: DemoNewsApp,
//         context: SlashCommandContext,
//         read: IRead,
//         modify: IModify,
//         http: IHttp,
//         persistence: IPersistence,
//         filter = {}
//     ) {
//         // logic to fetch news from the source
//     }

//     async saveNews(persistence: IPersistence) {
//         // logic to save news to persistence storage
//     }

//     async getNews(persistence: IPersistence, filter) {
//         // logic to get news from persistence storage
//         // return the news according to filter
//     }
// }

export abstract class NewsSource {
    private readonly news: NewsItem[] = [];
    constructor(app: DemoNewsApp) {}

    abstract fetchNews(read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void>

    // async saveNews(persis: IPersistence) {}

    // async getNews(persis: IPersistence, persisReader: IPersistenceRead) {}

}
