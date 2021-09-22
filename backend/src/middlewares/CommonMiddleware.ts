import cors from 'cors';
import morgan from 'morgan';
import { Express, json } from 'express';


export class CommonMiddleware {
    app: Express;

    constructor(_app: Express) {
        this.app = _app;
    }

    public async useJson() { 
        this.app.use(json()); 
    }

    public async useCors() {
        this.app.use(cors());
    }

    public async logRequests() {
        this.app.use(morgan('tiny'))
    }

}
