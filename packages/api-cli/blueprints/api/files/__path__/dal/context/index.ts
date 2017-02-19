import { IRepository } from '../repository';
import { MongoContextFactory } from './mongo';

export interface IDataContext { }

export let getContext = async (settings: any, cache): Promise<IDataContext> => {
    let context: IDataContext;
    switch (settings.dbType) {
        case 'mongo': context = await MongoContextFactory.createDbContext(settings.mongo, cache);
    }
    return context;
}

