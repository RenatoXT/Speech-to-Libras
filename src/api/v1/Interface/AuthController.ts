import { Request, Response } from "express";
import { AbstractRouteController } from "../../../routes/AbstractRouteController";

import { generateSignInUrl, getGoogleAccountFromCode } from "../../../utils/google/google-utils";
import UsersDao from "../Data/mongo/users.dao";
import { MongoUser } from "../Entities/mongoUser.model";

import { AuthService } from "../Service/AuthService";

export class AuthController extends AbstractRouteController {
    private _service: AuthService;

    constructor() {
        super();
        this.path += "/Auth";
        this._service = new AuthService();
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetGoogle();
        await this.InitializeResultGoogle();
    }

    public async InitializeGetGoogle() {
        this.router.get(this.path, this._service.googleAuth).bind(this);
    }

    public async InitializeResultGoogle() {
        this.router.get(this.path + "/GoogleAuth", this._service.googleAuthResult).bind(this);
    }
}