export class Log {

    static error(err:any){
        let message = err.msg || err.message || err.errorMessage || err.errMessage || null;
        if(message) console.error('ERROR: ' + message);
        console.error('Error: ' + JSON.stringify(err))
    }

    static write(event:string){
        console.log('Log: ' + event);
    }

    static info(message:string){
        console.info('Info: ' + message);
    }
}