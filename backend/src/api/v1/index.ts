import { AbstractRouteController } from "../../routes/AbstractRouteController";
import { AuthController } from "./Interface/AuthController";


export function getAllRoutes(): Promise<Array<AbstractRouteController>> {
    let routes: Array<AbstractRouteController> = [];
    routes.push(new AuthController());

    return Promise.resolve(routes);
};