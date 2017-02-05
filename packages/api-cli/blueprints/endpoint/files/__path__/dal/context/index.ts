import { IRepository } from '../repository'; 
import { MongoContextFactory } from './mongo';
import { IEvent } from '../../models/event';

export interface IDataContext {
    events: IRepository<IEvent>
}

export let getContext = async (settings:any): Promise<IDataContext> => {
    let context: IDataContext;
    switch(settings.dbType){
        case 'mongo': context = await MongoContextFactory.createDbContext(settings.mongo);
    }
    return context;
}

