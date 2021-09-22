import dotenv from 'dotenv';
import Path from 'path';

// Set path for .env file
dotenv.config({ path: Path.join(__dirname, '..', '/configs/.env') });

export default class Config {
    public static PORT = process.env.PORT || 3515;
    public static ENVIRONMENT = process.env.ENVIRONMENT || "prod"

    public static APPLICATION_NAME = process.env.APPNAME;
    public static DEFAULT_ROUTE_NAME = `/api/${Config.APPLICATION_NAME}/v1`;

    public static GoogleConfig = {
        ClientId : process.env.ClientId,
        ClientSecret : process.env.ClientSecret,
        ClientRedirect : process.env.ClientRedirect,
    }
}