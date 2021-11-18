import { Request, Response } from "express";
import { AbstractRouteController } from "../../../routes/abstract-route.entity";

import { UserService } from "../Service/user.service";

export class UserController extends AbstractRouteController {
    
    private _service : UserService;

    constructor() {
        super();
        this.path += "/User";
        this._service = new UserService();
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetUser();
        await this.InitializePutUser();
        await this.InitializeDeleteUser();
    }

    public async InitializeGetUser() {
        this.router.get(this.path + "/:email", this._service.getUser ).bind(this);
    }

    public async InitializePutUser() {
        this.router.put(this.path, this._service.updateUser).bind(this);
    }

    public async InitializeDeleteUser() {
        this.router.delete(this.path + "/:email", this._service.deleteUser).bind(this);
    }

}