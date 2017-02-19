import * as minimist from 'minimist';
import { Log } from './lib/log';

export let config = () => {
    let supportedDatabases = ['mongo'];
    let margv = minimist(process.argv);
    let port = margv['apiPort'] || '6100';
    let dbType = margv['dbType'] || 'mongo';
    let redis_url = margv['redis'] || 'localhost';
    let redis_port = margv['redisPort'] || 6379;
    let db_cache_timeout = margv['dbCacheTimeout'] || 15;
    let api_cache_timeout = margv['apiCacheTimeout'] || 15;


    if (supportedDatabases.indexOf(dbType) < 0) {
        let error = new Error(dbType + ' is not a supported Database type.');
        error['supportedDbs'] = supportedDatabases;
        Log.error(error);
        throw error;
    }

    let redis = {
        host: redis_url,
        port: redis_port,
        url: "redis://" + redis_url + ":" + redis_port
    };

    let mongo = {
        url: margv['mongoUrl'] || 'localhost',
        port: margv['mongoPort'] || '27017',
        collection: margv['mongoCollection'] || '<%= htmlComponentName.toLowerCase() %>'
    }
    return {
        port: port,
        dbType: dbType,
        mongo: mongo,
        redis: redis,
        cache: {
            apiTimeout: api_cache_timeout,
            dbTimeout: db_cache_timeout
        }
    }
}