import { Document, Schema } from 'mongoose';
import { MongoRepository } from '../dal/repository/mongo';
import { Mongo, IMongoSettings } from '../dal/connection/mongo';
import { SchemaUtil } from '../lib/schema';
import { Validator } from '../lib/validator';

export let jsonSchema = { }

export interface I<%= classifiedModuleName %> extends Document { }

export const <%= classifiedModuleName %> = (config:IMongoSettings) => { 
    var instance = Mongo.connect(config);
    return instance.model('<%= classifiedModuleName %>', SchemaUtil.jsonToMongo(this.jsonSchema));
}

class <%= classifiedModuleName %>Repository extends MongoRepository<any> {
    constructor(config:IMongoSettings, cache) {
        super(<%= classifiedModuleName %>(config), cache);
    }
}

export let validate = (req, res, next) => {
    let errors = new Validator().json(jsonSchema, req.body)
    if(errors) { return res.status(400).send(errors); }
    next();
}

export let <%= classifiedModuleName.toLowerCase() %>Repository = (config:IMongoSettings, cache) => { return new <%= classifiedModuleName %>Repository(config, cache); }