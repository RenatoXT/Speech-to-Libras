import { Express } from 'express';
import { CommonMiddleware  } from '../middlewares/common.middleware';
import { ErrorHandlingMiddleware } from '../middlewares/error-handling.middleware';

export class InitializeMiddleware {
    
    public static async InitializeCommonMiddleware(app: Express) {
        let middleware = new CommonMiddleware(app);
        
        await middleware.useJson();
        await middleware.useCors();
        await middleware.useFileUpload();
        await middleware.logRequests();
        // await middleware.logRequests();
        await middleware.templateEngine();
    }
    
    public static async InitializeErrorHandlingMiddleware(app: Express) {
        let errorMiddleware = new ErrorHandlingMiddleware(app);

        await errorMiddleware.handle404Error();
    }

}