import { IDataContext } from './';
import { eventRepository } from '../../models/event';
import { IMongoSettings } from '../connection/mongo';

export class MongoContextFactory {
    static createDbContext(dbSettings:IMongoSettings): Promise<IDataContext> {
        return new Promise(async (resolve, reject) => {
            let dbContext = {
                events: eventRepository(dbSettings)
            };
            resolve(dbContext);
        });
    }
}