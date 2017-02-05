import * as ajv from 'ajv';

export class Validator {
    private validator;
    constructor() {
        this.validator = ajv({ allErrors: true });        
    }

    json(schema, message){        
        let result = null;
        this.addFormats();
        var inspect = this.validator.compile(schema)
        var valid = inspect(message);
        if(!valid){
            result = inspect.errors;
        }
        return result;
    }

    private addFormats(){
        this.validator.addFormat('email', /^.+@[^@.]+(([\.][a-z]{2,}){1,2})$/);
    }  
}