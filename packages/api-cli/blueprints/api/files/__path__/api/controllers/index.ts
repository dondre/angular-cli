import { IDataContext } from '../../dal/context';


export class Controllers {

    constructor(context: IDataContext) { }
}

export interface IControllerResponse {
    statusCode: number,
    payload: any
}
