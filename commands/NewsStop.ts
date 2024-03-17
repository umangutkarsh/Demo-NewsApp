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

export class NewsStop implements ISlashCommand {
    public command = "stop-news";
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

        const jobId = context.getArguments();
        console.log(jobId);

        await modify.getScheduler().cancelJob(jobId[0]);

    }
}
