import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ExecutorProps } from '../../definitions/ExecutorProps';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { DemoNewsApp } from '../../DemoNewsApp';
import { NewsSlashCommandContext } from '../NewsCommand';
import { sendMessage } from '../../lib/sendMessage';
import { buildNewsBlock } from '../../blocks/UtilityBlock';

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
        const apiKey = `a23a2e02df0cd1192f391ee41e5a8fcc`;

        const getApiEndpoint = () => `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&max=${max_content}&apikey=${apiKey}`;

        try {
            const response = await http.get(getApiEndpoint());
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
}
