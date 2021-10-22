import { Collection, Document, Filter, FindCursor, GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { ISign, MongoSigns } from '../../Entities/mongo-libras.entities';

let signs: Collection<Document>;

export default class LibrasTranslateDao {

    static async injectDB(conn: MongoClient) {

        if (signs) {
            return 
        } 

        try {
            signs = await conn.db(process.env.RESTREVIEWS_NS).collection("libras-signs")
        } catch( err) {
            console.error( `Unable to estabilish a collection handle in LibrasTranslateDao: ${err}` );
        }
    }

    public static async createSign(sign: ISign ) {

        const newSign = new MongoSigns()
        newSign.assignValues(sign);

        let findSign = await this.searchSign(newSign.name);
        let result;

        if ( findSign ==  null || !findSign ) {
            const dbResp = await signs.insertOne(newSign);
            result = dbResp
        } else {
            result =  {
                error: "Sinal já cadastrado!"
            }
        }

        return result;
    }

    public static async getSign( name: string ) {
        const searchRes = this.searchSign(name);
        let result;

        if ( searchRes == null || searchRes ) {
            result =  {
                error: "Sinal não encontrado!"
            }
        } else {
            result = searchRes;
        }

        return result;
    }

    private static async searchSign( name: string ) {
        try {
            let result = await signs.findOne({ "name": name });
    
            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

    public static async updateSign( params: ISign) {
        try {
            let result;
            let findUser = await this.searchSign(params.name);

            if ( findUser ){
                const updateSign = new MongoSigns();
                updateSign.assignValues(findUser);
                updateSign.assignValues(params);
    
    
                result = await signs.updateOne(
                    { "name": params.name },
                    { "$set": updateSign }
                );
            } else {
                result =  {
                    error: "O sinal não está cadastrado! Crie-o antes de tentar atualizar algo"
                }
            }

            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }

    public static async deleteSign( name: string ) {
        try {
            let result;
            let findUser = await this.searchSign(name);

            if ( findUser ){
                result = await signs.deleteOne({ "name": name });
            } else {
                result =  {
                    error: "O sinal não está cadastrado! Crie-o antes de excluir"
                }
            }

            return result;
        } catch ( err ) {
            const msg = (err as Error).message;
            return JSON.stringify({ error: msg })
        }
    }
   
}