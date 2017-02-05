import { eventRoutes } from './event'
import { IDataContext } from '../../dal/context';

export let Routes = {
    
    init: (app, context:IDataContext) => {
        eventRoutes(app, context);
    }
}