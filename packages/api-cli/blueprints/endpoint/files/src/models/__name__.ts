import { Document, Schema } from 'mongoose';
import { MongoRepository } from '../dal/repository/mongo';
import { Mongo, IMongoSettings } from '../dal/connection/mongo';
import { SchemaUtil } from '../lib/schema';
import { Validator } from '../lib/validator';

export let jsonSchema = {
    type: 'object',
    properties: {
        category: { 
            type: 'object', 
            properties: {
                name: { type: 'string' }
            }
        },
        title: { type: 'string', uniqueItems: true },
        tags: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        articles: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }
        },
        videos: {
            type: 'array',
            items: { 
                type: 'object',
                properties: {
                    videoId: { type: 'string' },
                    title: { type: 'string', default: 'Untitled' },
                    description: { type: 'string', default: "No description" },
                    publishedDate: { type: 'string' },
                    channelId: { type: 'string' },
                    channelTitle: { type: 'string' },
                    etag: { type: 'string' },
                    embedHtml: { type: 'string' },
                    duration: { type: 'number' },
                    topics: { 
                        type: 'array', 
                        items: { type: 'string' }
                    },
                    thumbnails: { 
                        type: 'object',
                        properties: {
                            default: { type: 'string' },
                            medium: { type: 'string' },
                            high: { type: 'string' }
                        },
                        required: ['default']
                    }
                },
                required: ['videoId', 'title', 'desription', 'publishedDate', 'channelId', 'embedHtml', 'duration', 'thumbnails']
            }
        }
    },
    required: ['title']
}

export interface I<%= classifiedModuleName %> extends Document {}

export const <%= classifiedModuleName %> = (config:IMongoSettings) => { 
    var instance = Mongo.connect(config);
    return instance.model('<%= classifiedModuleName %>', SchemaUtil.jsonToMongo(this.jsonSchema));
}

class <%= classifiedModuleName %>Repository extends MongoRepository<any> {
    constructor(config:IMongoSettings) {
        super(<%= classifiedModuleName %>(config));
    }
}

export let validate = (req, res, next) => {
    let errors = new Validator().json(jsonSchema, req.body)
    if(errors) { return res.status(400).send(errors); }
    next();
}

export let <%= classifiedModuleName.toLowerCase() %>Repository = (config:IMongoSettings) => { return new <%= classifiedModuleName %>Repository(config); }