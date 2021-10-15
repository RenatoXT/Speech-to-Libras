import { Express, Response, Request } from 'express';

export class ErrorHandlingMiddleware {

    app: Express;

    constructor(_app: Express) {
        this.app = _app;
    }

    public async handle404Error() {
        this.app.use((req: Request, resp: Response) => {
            resp.status(404).send("Exemplo de msg de erro");
        });
    }

}