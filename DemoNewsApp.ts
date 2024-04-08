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
// import { DailyNewsProcessor } from './services/schedulers/DailyNewsProcessor';
import { NewsGet } from './commands/NewsGet';

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

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        // other code
        // ...
        // configuration.scheduler.registerProcessors([new DailyNewsProcessor()]);
        configuration.slashCommands.provideSlashCommand(new NewsGet(this));
    }

}
