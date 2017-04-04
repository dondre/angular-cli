import { IDataContext } from './';
import { IMongoSettings } from '../connection/mongo';

export class MongoContextFactory {
    static createDbContext(dbSettings: IMongoSettings, cache): Promise<IDataContext> {
        return new Promise(async (resolve, reject) => {
            let dbContext = { };
            resolve(dbContext);
        });
    }
}