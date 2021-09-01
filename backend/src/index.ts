import app  from './server';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import Path from 'path';

import RestaurantsDao  from './dao/restaurants.dao';
import ReviewsDao from './dao/reviews.dao';

const env = dotenv.config({ path: Path.join(__dirname, '/configs/.env') });

const port = process.env.PORT || 8000 ;
const uri = process.env.RESTREVIEWS_DB_URI || '';
const clientOptions = { 
    maxPoolSize: 5, 
    wtimeoutMS: 2500 
};


const client = new MongoClient(uri, clientOptions);

client.connect()
    . catch ( err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await RestaurantsDao.injectDB(client);
        await ReviewsDao.injectDB(client);

        app.listen(port, () => {
            console.log(`:::listening on port ${port}`);
        })
    })