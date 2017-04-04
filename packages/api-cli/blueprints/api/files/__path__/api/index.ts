import { Routes } from './routes';
import { IDataContext } from '../dal/context';
import { Log } from '../lib/log';

let express = require('express');
let bodyParser = require('body-parser')
let app = express();
let cors = require('express-cors');
let openUI = require('swagger-ui-express');
let apiDoc = require('../../apidoc.json');

export class API {

    constructor(port: number, context: IDataContext) {
        this.initMiddleware();
        this.initOpenAPI();
        Routes.init(app, context);
        app.listen(port, () => {
            Log.write('API listening on port: ' + port);
        })
    }

    initMiddleware() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors({ allowedOrigins: ['localhost:*'] }));
    }

    initOpenAPI() {
        app.use('/api-docs', openUI.serve, openUI.setup(apiDoc));
    }

}