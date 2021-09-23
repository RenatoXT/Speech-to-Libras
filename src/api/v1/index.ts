import { UserController } from './Interface/UserController';
import { AbstractRouteController } from "../../routes/AbstractRouteController";
import { AuthController } from "./Interface/AuthController";


export function getAllRoutes(): Promise<Array<AbstractRouteController>> {
    let routes: Array<AbstractRouteController> = [];
    routes.push(new AuthController());
    routes.push(new UserController());

    return Promise.resolve(routes);
};