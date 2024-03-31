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
    static news: NewsItem[] = [];
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

    // static async determineCategory(context: SlashCommandContext, read: IRead, http: IHttp) {

    //     const room = context.getRoom();
    //     const appUser = (await read.getUserReader().getAppUser()) as IUser;


    //     const getOpenAIApiChatCompletion = () => `https://api.openai.com/v1/chat/completions`;
    //     const openAIApiKey = `${process.env.OPENAI_API_KEY}`;
    //     const getOpenAIPayload = (newsContent) => {
    //         const newsCategories = `General, Business and Finance, Technology, Entertainment, Sports, Politics, Health, International, Investigative Journalism`;
    //         const prompt = `This news -> ${newsContent} falls under which category out of these -> ${newsCategories}, answer in one word`
    //         const data = {
    //             model: "gpt-3.5-turbo",
    //             messages: [
    //                 {
    //                     role: "system",
    //                     content: prompt,
    //                 },
    //             ]
    //         }
    //         const headers = {
    //             'Content-Type': "application/json",
    //             "Authorization": `Bearer ${openAIApiKey}`,
    //         }

    //         return { headers, data };
    //     }

    //     let allNewsBlocks: Array<Array<Block>> = [];

    //     try {
    //         var message = `News fetched`;

    //         for (let i=0 ; i<this.news.slice(0, 3).length ; i++) {
    //                 const openAIResponse = await http.post(
    //                     getOpenAIApiChatCompletion(),
    //                     getOpenAIPayload(this.news[i].description),
    //                 );

    //                 const newsBlock = await buildNewsBlock(this.news[i]);
    //                 allNewsBlocks.push(newsBlock);
    //             }
    //             await sendMessage(modify, room, appUser, message, allNewsBlocks);
    //     } catch (err) {
    //         console.error('Error generating OpenAI response ', err);
    //     }
    // }

    static async detemineCategory(http: IHttp) {
        const response = await http.get(`https://techcrunch.com/wp-json/wp/v2/categories/577055593`);
        return response?.name; // will return the category in string format.
    }
}
