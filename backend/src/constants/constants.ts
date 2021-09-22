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

    public static STLVIEWS_NS = process.env.STLVIEWS_NS || "";
    public static STLVIEWS_DB_URI = this.generateDbUri();

    private static generateDbUri() {
        const STLUSER = process.env.STLUSER || "";
        const STLPASS = process.env.STLPASS || "";
        const STLCLUSTER = process.env.STLCLUSTER || "";

        let dbUri = process.env.STLVIEWS_DB_URI || "";

        dbUri = dbUri.replace("${STLVIEWS_NS}", Config.STLVIEWS_NS);
        dbUri = dbUri.replace("${STLUSER}", STLUSER);
        dbUri = dbUri.replace("${STLPASS}", STLPASS);
        dbUri = dbUri.replace("${STLCLUSTER}", STLCLUSTER);

        return dbUri;
    }
}