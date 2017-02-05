import { Routes } from './routes';
import { IDataContext } from '../dal/context';
import { Log } from '../lib/log'; 

let express = require('express');
var bodyParser = require('body-parser')
let app = express();


export class API {

    constructor(port:number, context:IDataContext){
        this.initMiddleware();
        Routes.init(app, context);
        app.listen(port, ()=> {
            Log.write('API listening on port: '+ port);
        })
    }

    initMiddleware(){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
    }

}