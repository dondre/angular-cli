import { Controllers } from '../controllers';
import { IDataContext } from '../../dal/context';
import { validate } from '../../models/event';

export let eventRoutes = (app, context:IDataContext) => {

    let controllers = new Controllers(context);

    app.get('/events', async (req,res) => {
        let result = await controllers.Event.get(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.get('/events/:id', async (req,res) => {
        let result = await controllers.Event.getId(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.post('/events', validate, async (req,res)=> {
        let result = await controllers.Event.post(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.put('/events/:id', validate, async (req, res)=> {
        let result = await controllers.Event.put(req);
        return res.status(result.statusCode).send(result.payload);
    })

    app.patch('/events/:id', async (req, res)=> {
        let result = await controllers.Event.patch(req);
        return res.status(result.statusCode).send(result.payload);
    })

}