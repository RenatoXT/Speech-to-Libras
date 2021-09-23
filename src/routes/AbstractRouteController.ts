import express, { Request, Response } from "express";
import Config from "../constants/constants";


export abstract class AbstractRouteController {
    router = express.Router();
    path: string = Config.DEFAULT_ROUTE_NAME;

    public async InitializeController() {
        await this.InitializeGet();
        await this.InitializePost();
    }
    
    public async runService(req: Request, resp: Response): Promise<any>{
        resp.send("runService Method for " + this.path + 'does not exist!');
    }
    
    public async InitializePost() {
        this.router.get(this.path, this.runService.bind(this)).bind(this);
    }

    public async InitializeGet() {
        this.router.get(this.path, this.runService.bind(this)).bind(this);
    }
}