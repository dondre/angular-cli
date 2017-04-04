import { IRepository } from './';
import { Mongoose, Document, Model } from 'mongoose';
import { config } from '../../config';

let mongoose = new Mongoose();

export class MongoRepository<Document> implements IRepository<Document> {

    private _model;
    private cacheTimeout: number;

    constructor(schemaModel, private redis) {
        this._model = schemaModel;
        this.cacheTimeout = config().cache.dbTimeout;
    }

    delete(id: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            this._model.remove({ _id: id }, (err) => {
                this.hasError(err) ? reject(err) : resolve(true);
            })
        });
    }

    findById(id: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            this._model.find({ _id: id })
                .exec()
                .onResolve((err, doc) => {
                    this.hasError(err) ? reject(err) : resolve(this.getDocument(doc))
                });
        })
    }

    update(id: string, doc: {}): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            var document: any = doc;
            //doc['_id'] = undefined; 
            this._model.update({ _id: id }, document, { upsert: true }, (err, rows, raw) => {
                this.hasError(err) ? reject(err) : resolve(rows);
            });
        });
    }

    patch(id: string, doc: {}): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            var document: any = doc;
            //doc['_id'] = undefined; 
            this._model.update({ _id: id }, { $set: document }, (err, rows, raw) => {
                this.hasError(err) ? reject(err) : resolve(rows);
            });
        });
    }

    getAll(): Promise<[{}]> {
        return new Promise(async (resolve, reject) => {
            this._model.find(x => x != undefined)
                .exec()
                .onResolve((err, doc) => {
                    this.hasError(err) ? reject(err) : resolve(this.getDocument(doc));
                });
        });
    }
    find(json: {}): Promise<[{}]> {
        return new Promise(async (resolve, reject) => {
            this._model.find(json)
                .exec()
                .onResolve((err, doc) => {
                    this.hasError(err) ? reject(err) : resolve(this.getDocument(doc));
                });
        });
    };
    findOne(json: {}): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            this._model.findOne(json)
                .exec()
                .onResolve((err, doc) => {
                    this.hasError(err) ? reject(err) : resolve(this.getDocument(doc));
                });
        });
    };
    save(doc: Document): Promise<{}> {
        return new Promise((resolve, reject) => {
            this._model.create(doc, (err: any, doc) => {
                this.hasError(err) ? reject(err) : resolve(this.getDocument(doc));
            });
        });
    }

    private getDocument(doc: any) {
        let result;
        if (Array.isArray(doc)) {
            result = [];
            if(doc.length) {
                doc.forEach(d => { d.hasOwnProperty('_doc') ? result.push(d._doc) : result.push(d); })
            }
        } else {
            result = doc.hasOwnProperty('_doc') ? doc._doc : doc;
        }
        return result;
    }

    private hasError(err: any): Boolean {
        let result = false;
        if (err) {
            console.error('Mongo: ' + JSON.stringify(err));
            result = true;
        }
        return result;
    }
}
