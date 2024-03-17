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

export class NewsCommand implements ISlashCommand {
    public command = "news";
    public i18nParamsExample = "";
    public i18nDescription = "This is the main command for news-app";
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


        this.app.getLogger().info(`Slash command ${this.command} initiated with trigger: ${context.getTriggerId()}, and arguments ${context.getArguments()}`);

        if (!subcommands) {
            var message = `No subcommands found`;
            await sendMessage(modify, room, sender, message);
        } else {
            const commandUtility = new CommandUtility({
                sender,
                room,
                command: subcommands,
                context,
                read,
                modify,
                http,
                persistence: persis,
                app: this.app,
            })
            console.log('COMMAND: ', this.command);
            console.log('COMMAND ARRAY: ', subcommands);

            this.app.getLogger().info(this.command);

            switch (subcommands[0]) {
                case "fetch":
                    await commandUtility.fetchNews({
                        app: this.app,
                        context,
                        read,
                        modify,
                        http,
                        persistence: persis,
                    });

                    console.log('Valid commands: ', subcommands);
                    this.app.getLogger().info('commands: ', subcommands);

                    break;

                case "schedule":
                    await commandUtility.scheduleNews({
                        app: this.app,
                        context,
                        read,
                        modify,
                        http,
                        persistence: persis,
                    });

                    console.log('Valid commands: ', subcommands);
                    this.app.getLogger().info('commands: ', subcommands);

                    break;

                case "stop":
                    await commandUtility.stopNews({
                        app: this.app,
                        context,
                        read,
                        modify,
                        http,
                        persistence: persis,
                    });

                    console.log('Valid commands: ', subcommands);
                    this.app.getLogger().info('commands: ', subcommands);

                    break;

                default:
                    message = `Invalid sub-command`;
                    console.log('Invalid commands: ', subcommands);
                    this.app.getLogger().info('commands: ', subcommands);

                    await sendMessage(modify, room, appUser, message);
                    break;
            }
        }
    }
}
