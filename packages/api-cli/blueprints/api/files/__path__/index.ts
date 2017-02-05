import { API } from './api';
import { config } from './config';
import { IDataContext, getContext } from './dal/context';
import { MongoContextFactory } from './dal/context/mongo';

(async() => {
    let settings = config();
    let context = await getContext(settings);
    let api = new API(settings.port, context);
})();