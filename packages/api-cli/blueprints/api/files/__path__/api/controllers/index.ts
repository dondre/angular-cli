import { EventController } from './event';
import { IDataContext } from '../../dal/context';


export class Controllers {

    public Event: EventController;

    constructor(context:IDataContext){
        this.Event = new EventController(context);
    }
}

export interface IControllerResponse {
    statusCode:number,
    payload:any
}
