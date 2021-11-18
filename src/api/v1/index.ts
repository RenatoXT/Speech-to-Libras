import { AbstractRouteController } from "../../routes/abstract-route.entity";


import { UserController } from "./Application/user.controller";
import { AuthController } from "./Application/auth.controller";
import { TranslateController } from "./Application/translate.controller";
import { LibrasTranslateController } from './Application/libras-translate.controller';


export function getAllRoutes(): Promise<Array<AbstractRouteController>> {
    let routes: Array<AbstractRouteController> = [];
    routes.push(new AuthController());
    routes.push(new UserController());
    routes.push(new TranslateController());
    routes.push(new LibrasTranslateController());

    return Promise.resolve(routes);
};