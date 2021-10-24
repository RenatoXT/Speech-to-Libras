import { InitializeDB } from '../db/database.initializer';
import express, { Express } from 'express';

import Config from '../constants/constants';

import { InitializeMiddleware } from './middleware.initializer';
import { InitializeRoutes } from './routes.initializer';

export async function server() {
    let app: Express = express();

    let port = Config.PORT;

    await InitializeMiddleware.InitializeCommonMiddleware(app);
    await InitializeRoutes.Initialize(app);
    // await InitializeMiddleware.InitializeErrorHandlingMiddleware(app);
    await InitializeDB.initalize()

    app.listen(port, () => {
        console.log(
            `Server  started listening on ${port} port.`
        );
    });

}