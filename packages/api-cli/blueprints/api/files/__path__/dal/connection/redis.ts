import * as redis from 'redis';

var options: redis.ClientOptions;
var async = require('async');

export class Redis {
    private static client: redis.RedisClient;
    private static options: redis.ClientOptions;

    constructor(options?: redis.ClientOptions) {
        if (options && !Redis.options) {
            Redis.options = options;
        }
        if (!Redis.client) {
            Redis.client = redis.createClient(Redis.options);
        }
    }

    set(key, value) {
        if (typeof (value) === 'object') {
            value = JSON.stringify(value);
        }
        Redis.client.set(key, value, redis.print);
    }

    get(key, isJson?: boolean) {
        isJson = isJson == undefined ? true : isJson;
        var promise = new Promise((resolve, reject) => {
            Redis.client.get(key, (err, reply) => {
                return err ? reject(err) : resolve(isJson ? JSON.parse(reply) : reply);
            });
        });
        return promise;
    }

    clear(prefix: string) {
        Redis.client.keys(prefix + '*', (err, rows) => {
            async.each(rows, (row, callbackDelete) => {
                Redis.client.del(row, callbackDelete)
            })
        });
    }
}