import * as request from "request";

export class WebRequest {


    async get(url:string, options?) {
        return new Promise((resolve,reject)=> {
            try {
                request.get(url, options, (err, response, body)=> {
                    if(err) return reject(err);
                    resolve(JSON.parse(body))
                })
            } catch (e) {
                reject(e);
            }
        })
    };

    async post(url:string, options?) {
        return new Promise((resolve,reject)=> {
            try {
                request.post(url, options, (err, response, body)=> {
                    if(err) return reject(err);
                    resolve(JSON.parse(body))
                })
            } catch (e) {
                reject(e);
            }
        })
    };

    async put(url:string, options?) {
        return new Promise((resolve,reject)=> {
            try {
                request.put(url, options, (err, response, body)=> {
                    if(err) return reject(err);
                    resolve(JSON.parse(body))
                })
            } catch (e) {
                reject(e);
            }
        })
    };

}