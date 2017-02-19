import { IDataContext } from '../../dal/context';


export class Controllers {

    constructor(context: IDataContext, cache) {
    }
}

export interface IControllerResponse {
    statusCode: number,
    payload: any
}
