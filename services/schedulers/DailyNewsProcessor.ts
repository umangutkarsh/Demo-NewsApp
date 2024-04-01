import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IJobContext, IProcessor } from '@rocket.chat/apps-engine/definition/scheduler';
import { RoomPersistence } from '../../persistence/rooms';

export class DailyNewsProcessor implements IProcessor {
    public id = "daily-news";
    async processor(jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        // this would get the daily news in respective rooms.
        const context = jobContext;
        const {category, interval, news, ...other_params} = context;

        const roomPersistence = new RoomPersistence(
            persis,
            read.getPersistenceReader()
        );
        const subscribedRooms = await roomPersistence.getAllSubscribedRooms(
            interval,
            category
        );

        // setting blocks
        const blocks = getNewsBlock(news);
        const sendNews = async (subscribedRooms) => {
            try {
                const room = await read.getRoomReader().getById(subscribedRooms.room.id);
                if (room) {
                    const newsBuilder = modify.getCreator()
                        .startMessage()
                        .setRoom(room)
                        .setBlocks(blocks);
                    await modify.getCreator().finish(newsBuilder);
                }
            } catch (err) {
                console.error(err);
            }
        };
        await Promise.all(subscribedRooms.map(sendNews))
    }
}
