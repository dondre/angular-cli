import * as minimist from 'minimist';
import { Log } from './lib/log';

export let config = () =>  {
    let supportedDatabases = ['mongo'];
    let margv = minimist(process.argv);
    let port = margv['apiPort'] || '6100';
    let dbType = margv['dbType'] || 'mongo';

    if(supportedDatabases.indexOf(dbType) < 0) {
        let error = new Error(dbType + ' is not a supported Database type.');
        error['supportedDbs'] = supportedDatabases;
        Log.error(error);
        throw error;
    }

    let mongo = {
        url: margv['mongoUrl'] || 'localhost',
        port: margv['mongoPort'] || '27017',
        collection: margv['mongoCollection'] || '<%= htmlComponentName.toLowerCase() %>'
    }
    return {
        port: port,
        dbType: dbType,
        mongo: mongo
    }
}