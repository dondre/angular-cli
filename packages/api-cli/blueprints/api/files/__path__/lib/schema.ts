import { Schema } from 'mongoose';
import { Log } from './log';

export class SchemaUtil {
    
    static jsonToMongo(schema) {
        let result = {};
        if(schema.type == 'object'){
            result = this.jsonToMongoObject(schema)
        }
        return new Schema(result);
    }

    static isValidJson(schema) {
        let error = null;
        try {
            if(schema.type == 'object'){
                let output = this.jsonToMongoObject(schema);
                new Schema(output);
            } 
        } catch (err) {
            error = err;
        }
        return error;
    }

    private static jsonToMongoProperty(schema) {
        let propType = schema.type;
        let tempNode = {}

        switch(propType){
            case 'string':
                tempNode['type'] = 'String';
                if(schema.pattern) {
                    tempNode['match'] = schema.pattern;
                }
                if(schema.enum) {
                    tempNode['enum'] = schema.enum;
                }
            break;
            case 'number':
                tempNode['type'] = 'Number';
                if(schema.minimum) {
                    tempNode['min'] = schema.minimum;
                }
                if(schema.maximum) {
                    tempNode['max'] = schema.maximum;
                }
            break;
            case 'date':
                tempNode['type'] = 'Date';
            break;
            default:
                tempNode['type'] = propType;
            break;
        }
        if(schema.uniqueItems){
            //tempNode['unique'] = true;
        }
        if(schema.default){
            tempNode['default'] = schema.default;
        }
        if(schema.required) {
            tempNode['required'] = true;
        }
        return tempNode;
    }

    private static jsonToMongoObject(schema) {
        let result = {}
        let keys = Object.keys(schema.properties);
        keys.forEach((key:any)=> {
                let tempNode = {}
                let propertyType = schema.properties[key].type;
                switch(propertyType){
                    case 'string':
                        tempNode['type'] = 'String';
                        if(schema.properties[key].pattern) {
                            tempNode['match'] = schema.properties[key].pattern;
                        }
                        if(schema.properties[key].enum) {
                            tempNode['enum'] = schema.properties[key].enum;
                        }
                    break;
                    case 'number':
                        tempNode['type'] = 'Number';
                        if(schema.properties[key].minimum) {
                            tempNode['min'] = schema.properties[key].minimum;
                        }
                        if(schema.properties[key].maximum) {
                            tempNode['max'] = schema.properties[key].maximum;
                        }
                    break;
                    case 'date':
                        tempNode['type'] = 'Date';
                    break;
                    case 'object':
                        let innerSchema = this.jsonToMongoObject(schema.properties[key]);
                        tempNode = { type: new Schema(innerSchema) };
                    break;
                    case 'array': 
                        let inner;
                        if(schema.properties[key].items.properties != undefined) {
                            inner = this.jsonToMongoObject(schema.properties[key].items);
                            tempNode = { type: [new Schema(inner)] };
                        }
                        else {
                            inner = this.jsonToMongoProperty(schema.properties[key].items);
                            tempNode = { type: [inner] };
                        }  
                    break;
                }

                if(schema.properties[key].uniqueItems){
                    tempNode['unique'] = true;
                }
                if(schema.properties[key].default){
                    tempNode['default'] = schema.properties[key].default;
                }
                if(schema.required && schema.required.indexOf(key)+1){
                    tempNode['required'] = true;
                }
                result[key] = tempNode;
            })
        return result;
    }
}