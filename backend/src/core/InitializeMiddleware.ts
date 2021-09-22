import { Express } from 'express';
import { CommonMiddleware  } from '../middlewares/CommonMiddleware';
import { ErrorHandlingMiddleware } from '../middlewares/ErrorHandlingMiddleware';

export class InitializeMiddleware {
    
    public static async InitializeCommonMiddleware(app: Express) {
        let middleware = new CommonMiddleware(app);
        
        await middleware.useJson();
        await middleware.useCors();
        await middleware.logRequests();
    }
    
    public static async InitializeErrorHandlingMiddleware(app: Express) {
        let errorMiddleware = new ErrorHandlingMiddleware(app);

        await errorMiddleware.handle404Error();
    }

}