import { Collection, Document, Filter, FindCursor, MongoClient, ObjectId } from 'mongodb';
import { IMongoUser } from '../../Entities/mongo-user.interface';
import { MongoUser } from '../../Entities/mongo-user.model';

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

            let findUser = await this.searchUser(params.email);
            let result;

            if ( findUser == null || !findUser ){
                result = await users.insertOne(newUser);
            } else {
                result =  {
                    error: "Usuário já cadastrado!"
                }
            }
            console.log(result)
            return result;
        } catch (err) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

    public async searchUser( email: string ) {
        try {
            let result = await users.findOne({ "email": email });
            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

    public async updateUser( params: IMongoUser) {
        try {
            let result;
            let findUser = await this.searchUser(params.email);

            if ( findUser ){
                const updateUser = new MongoUser();
                updateUser.assignValues(findUser);
                updateUser.assignValues(params);
    
    
                result = await users.updateOne(
                    { "email": params.email },
                    { "$set": updateUser }
                );
            } else {
                result =  {
                    error: "O usuário não está cadastrado! Crie uma conta antes de tentar atualizar algo"
                }
            }

            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

    public async deleteUser( email: string ) {
        try {
            let result;
            let findUser = await this.searchUser(email);

            if ( findUser ){
                result = await users.deleteOne({ "email": email });
            } else {
                result =  {
                    error: "O usuário não está cadastrado! Crie um usuário antes de excluir"
                }
            }

            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }
   
}