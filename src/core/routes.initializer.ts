import { Express } from 'express';
import { getAllRoutes } from '../api/v1/index'
import { AbstractRouteController } from '../routes/abstract-route.entity';

export class InitializeRoutes {
    public static async Initialize(app: Express){
        let routes = await this.getRoutes();


        routes.forEach(rc => {
            app.use("/", rc.router);
        });

        // app.use("*", (req, resp) => {
        //     resp.status(404).json({ error: "invalid route"});
        // });
    }

    public static async getRoutes(): Promise<Array<AbstractRouteController>> {
        let routes: Array<AbstractRouteController> = [];

        const fRouter = await getAllRoutes();

        routes.push(...fRouter);

        return Promise.resolve(routes);
    }
}
