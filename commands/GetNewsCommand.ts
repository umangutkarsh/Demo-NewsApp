import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { NewsSource } from '../definitions/NewsSource';
import { sendMessage } from '../lib/sendMessage';
// import { TechCrunchNewsSource } from './utils/TechCrunchNewsSource';

// export class GetNewsCommand implements ISlashCommand {
//     public command = 'get-news';
//     public i18nParamsExample = "";
//     public i18nDescription = "This is the command to get news on demand";
//     public providesPreview = false;

//     public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
//         const [category] = context.getArguments();
//         const room = context.getRoom();
//         const sender = context.getSender();

//         // using just a single source for a demo.
//         const newsSourceInstance = new TechCrunchNewsSource(config, news);
//         const filter = {categories: [category]};
//         const newsItems = await newsSourceInstance.getNews(persis, filter);
//         const newsDigestBuilder = await modify.getCreator().startMessage().setRoom(room).setSender(sender).setParseUrls(true);

//         const blocks = createDigestBlock(newsItems);
//         // set the required blocks to display news
//         messageBuilder.setBlocks(blocks);

//         await modify.getCreator().finish(newsDigestBuilder);

//         switch(category) {
//             case "tech":
//                 // fetch news from persistence storage with category technology.

//             case "sports":
//                 // fetch news from persistence storage with category sports.

//             // handle other categories

//             default:
//                 // handle default case.
//         }
//     }
// }
