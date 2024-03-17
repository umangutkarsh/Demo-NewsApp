import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { DemoNewsApp } from '../DemoNewsApp';
import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendMessage } from '../lib/sendMessage';
import { buildNewsBlock } from '../blocks/UtilityBlock';
import { CommandUtility } from './utils/commandUtility';

export interface NewsSlashCommandContext {
    app: DemoNewsApp,
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persistence: IPersistence,
}

export class NewsSchedule implements ISlashCommand {
    public command = "schedule-news";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    constructor(private readonly app: DemoNewsApp) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const subcommands = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender();
        const appUser = (await read.getUserReader().getAppUser()) as IUser;

        const task = {
            id: 'fetchNewsTask',
            interval: '3 seconds',
            data: {
                context
            },
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

        await modify.getScheduler().scheduleOnce(onceTask);
    }
}
