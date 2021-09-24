import { MongoClient } from 'mongodb';

import UsersDao from '../api/v1/Data/mongo/users.dao';

import Config from '../constants/constants';

export class InitializeDB {
    
    static clientOptions = { 
        maxPoolSize: 5, 
        wtimeoutMS: 2500 
    };


    public static async initalize() {
        const client = new MongoClient(Config.STLVIEWS_DB_URI, InitializeDB.clientOptions);

        return client.connect()
            . catch ( err => {
                console.error(err.stack);
                process.exit(1);
            })
            .then(async client => {
                await UsersDao.injectDB(client);
            });
    }

}