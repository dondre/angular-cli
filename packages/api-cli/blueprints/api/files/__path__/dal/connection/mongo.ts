import { config } from '../../config';
import { Mongoose, Connection } from 'mongoose';
import { Log } from '../../lib/log';

export interface IMongoSettings {
    collection: string,
    port: string,
    url: string,
    options?: {
        auth: {
            user: string,
            password: string
        }
    }
}

export class Mongo {
    private static connections: {} = {};

    static connect(dbSettings:IMongoSettings): Mongoose {
        var instance = this.connections[dbSettings.collection];
        if (instance) {
            return instance;
        }

        var mongoose = new Mongoose();
        instance = {};
        instance.connection = mongoose.connection;
        instance.connection.once("open", () => {
            Log.write("MongoDb connected: " + dbSettings.url);
        });

        var connectUrl = this.createConnectUrl(dbSettings);
        instance = mongoose.connect(connectUrl);
        this.connections[dbSettings.collection] = instance;
        return instance;
    }

    private static createConnectUrl(dbSettings:IMongoSettings) {
        let connectUrl = 'mongodb://';
        var auth = dbSettings.options && dbSettings.options.auth;
        if (auth) {
            if (auth.user)
                connectUrl += auth.user + ':' + auth.password + '@';
        }

        connectUrl += dbSettings.url + ':' + dbSettings.port || '27017' + '/';
        connectUrl += dbSettings.collection;
        return connectUrl;
    }

}