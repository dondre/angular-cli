import { IControllerResponse } from './';
import { IEvent } from '../../models/event';
import { IDataContext } from '../../dal/context';

export class EventController {

    constructor(public context:IDataContext){}

    result:IControllerResponse = {
        statusCode: 200,
        payload: {}
    }

    get = async (req): Promise<IControllerResponse> => {   
        try {
            this.result.payload = await this.context.events.find({});
        } catch(err) {
            this.result.payload = err;
            this.result.statusCode = 500;
        }
        return this.result;
    }

    getId = async (req):Promise<IControllerResponse> => {
        let query, err;
        try {
            query = await this.context.events.find({ _id: req.params.id});
            this.result.payload = query[0];
        } catch (err) {
            err = err;
            this.result.statusCode = 500;
            this.result.payload = err;
        }
        if(!err && (!query || query.length == 0)){
            this.result.statusCode = 205,
            this.result['payload'] = { message: "Event with id of " + req.params.id + " not found." }
        }
        return this.result;
    }

    put = async (req):Promise<IControllerResponse> => {
        try {
            this.result.payload  = await this.context.events.update(req.params.id, req.body);
        }
        catch (err) {
            this.result.statusCode = 500;
            this.result.payload = err;
        }
        return this.result;
    }

    post = async (req):Promise<IControllerResponse> => {
        try {
            this.result.payload = await this.context.events.save(req.body);
        } catch(err) {
            this.result.statusCode = 500;
            this.result.payload = err;
        }
        return this.result;
    }

    patch = async (req): Promise<IControllerResponse> => {
        try {
            this.result.payload = await this.context.events.patch(req.params.id, req.body);
        } catch(err) {
            this.result.statusCode = 500;
            this.result.payload = err;
        }
        return this.result;
    }

}