import { Controllers } from '../controllers';
import { IDataContext } from '../../dal/context';
import { validate } from '../../models/<%= classifiedModuleName %>';

export let <%= classifiedModuleName.toLowerCase() %>Routes = (app, context:IDataContext) => {

    let controller = new Controllers(context).<%= classifiedModuleName %>;

    app.get('/<%= classifiedModuleName.toLowerCase() %>s', async (req,res) => {
        let result = await controller.get(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.get('/<%= classifiedModuleName.toLowerCase() %>s/:id', async (req,res) => {
        let result = await controller.getId(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.post('/<%= classifiedModuleName.toLowerCase() %>s', validate, async (req,res)=> {
        let result = await controller.post(req);
        return res.status(result.statusCode).send(result.payload);
    });

    app.put('/<%= classifiedModuleName.toLowerCase() %>s/:id', validate, async (req, res)=> {
        let result = await controller.put(req);
        return res.status(result.statusCode).send(result.payload);
    })

    app.patch('/<%= classifiedModuleName.toLowerCase() %>s/:id', async (req, res)=> {
        let result = await controller.patch(req);
        return res.status(result.statusCode).send(result.payload);
    })

}