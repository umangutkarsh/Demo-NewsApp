import { IModify } from '@rocket.chat/apps-engine/definition/accessors';

export class NewsDeliveryService {
    // this will be a scheduled job that will run at a specific time to deliver news to users
    // send news
    context;
    constructor(context, ...other_params) {}

    public async scheduleDailyNews(modify: IModify) {
        const dailyTask = {
            id: 'daily-news',
            interval: '1 day',
            data: {
                context
            },
            skipImmediate: false,

        }

        await modify.getScheduler().scheduleRecurring(dailyTask);
    }

    public async scheduleWeeklyNews(modify: IModify) {
        const weeklyTask = {
            id: 'weekly-news',
            interval: '1 week',
            data: {
                context
            },
            skipImmediate: false,

        }

        await modify.getScheduler().scheduleRecurring(weeklyTask);
    }
}

// {
//     "id": 123,
//     ...
//     ...
//     ...
//     "categories": [577055593], // categoryId
//     ...
// }
