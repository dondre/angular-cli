import { API } from './api';
import { config } from './config';
import { IDataContext, getContext } from './dal/context';
import { Redis } from './dal/connection/redis';
import { MongoContextFactory } from './dal/context/mongo';

(async () => {
    let settings = config();
    let cache = new Redis(settings.redis);
    let context = await getContext(settings, cache);
    let api = new API(settings.port, context, cache);
})();
