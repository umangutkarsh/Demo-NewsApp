import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { DemoNewsApp } from '../DemoNewsApp';
import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { TechCrunchNewsSource } from '../utils/TechCrunchNewsSource';

export class NewsGet implements ISlashCommand {
    public command = "news-get";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    constructor(private readonly app: DemoNewsApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const room = context.getRoom();
        const techCrunchInstance = new TechCrunchNewsSource(this.app);
        await techCrunchInstance.displayNews(read, modify, http, room, persis);
    }
}

