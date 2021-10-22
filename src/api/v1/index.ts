import { AbstractRouteController } from "../../routes/abstract-route.controller";

import { UserController } from './Interface/user.controller';
import { AuthController } from "./Interface/auth.controller";
import { TranslateController } from "./Interface/translate.controller";
import { LibrasTranslateController } from './Interface/libras-translate.controller';


export function getAllRoutes(): Promise<Array<AbstractRouteController>> {
    let routes: Array<AbstractRouteController> = [];
    routes.push(new AuthController());
    routes.push(new UserController());
    routes.push(new TranslateController());
    routes.push(new LibrasTranslateController());

    return Promise.resolve(routes);
};