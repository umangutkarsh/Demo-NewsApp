import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { NewsCommand } from './commands/NewsCommand';
import { NewsStop } from './commands/NewsStop';
import { CommandUtility } from './commands/utils/commandUtility';
import { NewsSchedule } from './commands/NewsSchedule';
import { settings } from './config/Settings';

export class DemoNewsApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    // public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    //     await configurationExtend.slashCommands.provideSlashCommand(new NewsCommand(this));
    //     await configurationExtend.slashCommands.provideSlashCommand(new NewsStop(this));
    //     await configurationExtend.slashCommands.provideSlashCommand(new NewsSchedule(this));


    //     configurationExtend.scheduler.registerProcessors([
    //         {
    //             id: 'fetchNewsTask',
    //             // processor: async (jobData) => {
    //             //     console.log('News Subscribed every 5 seconds');
    //             //     console.log('Data: ', jobData);
    //             // },
    //             // processor: async (jobData) =>
    //             // async processor(jobContext, read, modify, http, persis) {
    //             //     console.log('Context: ', jobContext);
    //             //     this.getLogger().info('Context: ', jobContext);


    //             // },
    //             // processor: async (jobContext) => {
    //             //     console.log('JOBCONTEXT: ', jobContext);

    //             //     // Extract the data passed to the task
    //             //     // const { app, context } = jobContext.data;

    //             //     // // Create an instance of CommandUtility
    //             //     // const commandUtility = new CommandUtility({
    //             //     //     context,
    //             //     //     read,
    //             //     //     modify,
    //             //     //     http,
    //             //     //     persistence,
    //             //     //     app,
    //             //     // });

    //             //     // // Call fetchNews
    //             //     // await commandUtility.fetchNews({
    //             //     //     app,
    //             //     //     context,
    //             //     //     read,
    //             //     //     modify,
    //             //     //     http,
    //             //     //     persistence,
    //             //     // });
    //             // },
    //             async processor(jobContext, read, modify, http, persis) {
    //                 console.log('log1');

    //                 console.log('JobContext: ', jobContext);
    //                 console.log('log-1.1');
    //                 console.log('log-1.2');
    //                 console.log('log2');
    //                 console.log('log2.1');

    //                 console.log('log2.2');

    //                 console.log('log3');

    //                 // Create an instance of CommandUtility
    //                 // const commandUtility = new CommandUtility({
    //                 //     app: this,
    //                 //     context,
    //                 //     read,
    //                 //     modify,
    //                 //     http,
    //                 //     persistence: persis,
    //                 // });

    //                 console.log('log4');

    //                 // // Call fetchNews
    //                 // await commandUtility.fetchNews({
    //                 //     app: this,
    //                 //     context,
    //                 //     read,
    //                 //     modify,
    //                 //     http,
    //                 //     persistence: persis,
    //                 // });
    //                 console.log('log5');

    //             },
    //         }
    //     ]);
    // }

    public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        // const roomStr = await environmentRead.getSettings().getValueById('news_channels');
        // if (!roomStr) {
        //     return;
        // }

        // const rooms: string[] = roomStr?.split(",").map((room) => room.trim());
        // if (!rooms.includes())

        await configuration.slashCommands.provideSlashCommand(new NewsCommand(this));
        await configuration.slashCommands.provideSlashCommand(new NewsStop(this));
        await configuration.slashCommands.provideSlashCommand(new NewsSchedule(this));

        const persistentReader = this.getAccessors().reader.getPersistenceReader();
        console.log('PersistenceReaderrr: ', persistentReader);
        console.log('DATa: ', await persistentReader.read('news_channel'));



        configuration.scheduler.registerProcessors([
            {
                id: 'fetchNewsTask',
                // processor: async (jobData) => {
                //     console.log('News Subscribed every 5 seconds');
                //     console.log('Data: ', jobData);
                // },
                // processor: async (jobData) =>
                // async processor(jobContext, read, modify, http, persis) {
                //     console.log('Context: ', jobContext);
                //     this.getLogger().info('Context: ', jobContext);


                // },
                // processor: async (jobContext) => {
                //     console.log('JOBCONTEXT: ', jobContext);

                //     // Extract the data passed to the task
                //     // const { app, context } = jobContext.data;

                //     // // Create an instance of CommandUtility
                //     // const commandUtility = new CommandUtility({
                //     //     context,
                //     //     read,
                //     //     modify,
                //     //     http,
                //     //     persistence,
                //     //     app,
                //     // });

                //     // // Call fetchNews
                //     // await commandUtility.fetchNews({
                //     //     app,
                //     //     context,
                //     //     read,
                //     //     modify,
                //     //     http,
                //     //     persistence,
                //     // });
                // },
                processor: async (jobContext, read, modify, http, persis) => {
                    console.log('scheduled-recurring');

                    // console.log('JobContext: ', jobContext);
                    // console.log('log-1.1');
                    // console.log('log-1.2');
                    // console.log('log2');
                    // console.log('log2.1');

                    // console.log('log2.2');

                    // console.log('log3');

                    // console.log('joBContext', jobContext);

                    const {context} = jobContext.data;
                    try {
                        // Create an instance of CommandUtility
                        const commandUtility = new CommandUtility({
                            app: this,
                            context,
                            read,
                            modify,
                            http,
                            persistence: persis,
                        });

                        console.log('log4');

                        // // Call fetchNews
                        await commandUtility.fetchNews({
                            app: this,
                            context,
                            read,
                            modify,
                            http,
                            persistence: persis,
                        });
                        } catch (err) {
                            this.getLogger().info(err);
                            console.error(err);

                        }
                    console.log('log5');

                },
            }
        ]);

        await Promise.all([
            settings.map((setting) => {
                configuration.settings.provideSetting(setting)
            }),
        ]);
    }
}
