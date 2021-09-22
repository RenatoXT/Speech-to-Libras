import { Collection, Document, Filter, FindCursor, MongoClient, ObjectId } from 'mongodb';
import { IMongoUser } from '../../Entities/IMongoUser';
import { MongoUser } from '../../Entities/mongoUser.model';

let users: Collection<Document>;

export default class UsersDao {
    
    static async injectDB(conn: MongoClient) {
        if (users) {
            return 
        } 

        try {
            users = await conn.db(process.env.RESTREVIEWS_NS).collection("users")
        } catch( err) {
            console.error( `Unable to estabilish a collection handle in usersDAO: ${err}` );
        }
    }
    
    public async createUser( params: IMongoUser) {
        try {
            const newUser = new MongoUser();
            newUser.assignValues(params);

            let result = await users.insertOne(newUser);
            return result;
        } catch (err) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

   
}