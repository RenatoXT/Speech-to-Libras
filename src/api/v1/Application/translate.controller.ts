import { Request, Response } from "express";
import { AbstractRouteController } from "../../../routes/abstract-route.entity";

import { TranslateService } from "../Service/translate.service";

export class TranslateController extends AbstractRouteController {
    private _service: TranslateService;

    constructor() {
        super();
        this.path += "/Translate";
        this._service = new TranslateService();
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializePost();
        await this.InitializeGet();
    }

    public async InitializePost() {
        this.router.post(this.path, this._service.translateTo).bind(this);
    }

    public async InitializeGet() {
        this.router.get(this.path + "/Languages", this._service.validLangs).bind(this);
    }
}