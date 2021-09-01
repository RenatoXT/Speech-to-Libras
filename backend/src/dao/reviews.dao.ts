import { Collection, Document, Filter, FindCursor, MongoClient, ObjectId } from 'mongodb';
import { IUser } from '../models/user.model';

let reviews: Collection<Document>;

export default class ReviewsDao {
    static async injectDB(conn: MongoClient) {
        if (reviews) {
            return 
        } 

        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch( err) {
            console.error( `Unable to estabilish a collection handle in reviewsDAO: ${err}` );
        }
    }

    static async addReview(restaurantId: string, user: IUser, review: string, date: Date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date,
                text: review,
                restaurant_id: new ObjectId(restaurantId),
            };

            return await reviews.insertOne(reviewDoc);
        } catch ( err ) {
            console.error( `Unable to post review: ${err}` );
            return { error: err };
        }
    }

    static async updateReview(reviewId: string, userId: string, text: string, date: Date) {
        try {

            const updateResponse = await reviews.updateOne(
                { 
                    user_id: userId, 
                    _id: new ObjectId(reviewId)
                },
                { $set: { 
                    text, 
                    date 
                }}
            );

            return updateResponse;
        } catch ( err ) {
            console.error( `Unable to update review: ${err}` );
            return { error: err };
        }
    }

    static async deleteReview(reviewId: string, userId: string) {
        try {

            const deleteResponse = await reviews.deleteOne(
                { 
                    user_id: userId, 
                    _id: new ObjectId(reviewId)
                }
            );

            return deleteResponse;
        } catch ( err ) {
            console.error( `Unable to delete review: ${err}` );
            return { error: err };
        }
    }

}