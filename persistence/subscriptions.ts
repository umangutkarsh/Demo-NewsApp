import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ISubscription } from '../definitions/Subscription';
import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

export class Subscription {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
    ) {}

    public async createSubscription(
        user: IUser,
        room: IRoom,
    ): Promise<boolean> {
        // logic to create a subscription
    }

    public async readSubscription(
        user: IUser,
        room: IRoom,
        interval: string,
    ): Promise<Array<ISubscription>> {
        // logic to get subscription from the persistence storage

        let subscriptions: ISubscription[];
        try {
            const associations: Array<RocketChatAssociationRecord> = [
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.MISC,
                    `subscription`
                ),
                new RocketChatAssociationRecord(
                    RocketChatAssociationModel.ROOM,
                    room?.id
                ),
            ];
            subscriptions = (await this.persistenceRead.readByAssociations(associations)) as Array<ISubscription>;
        } catch (err) {
            console.warn(err);
            subscriptions = [];
        }
        return subscriptions;
    }

    public async deleteSubscription(): Promise<boolean> {
        // logic to remove subscription
    }
}
