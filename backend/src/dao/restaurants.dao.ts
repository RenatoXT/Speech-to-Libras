import { Collection, Document, Filter, FindCursor, MongoClient } from 'mongodb';
import { IFilter } from '../../models/filter.model';

let restaurants: Collection<Document>;

export default class RestaurantsDao {
    static async injectDB(conn: MongoClient) {
        if (restaurants) {
            return 
        } 

        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch( err) {
            console.error(
                `Unable to estabilish a collection handle in restaurantsDAO: ${err}`
            );
        }
    }

    
    static async getRestaurants( filters: IFilter, page = 0, restaurantsPerPage = 20) {
        let query: Filter<Document> = {};

        if (filters) {
            if (filters.name) {
                query = { $text: { $search: filters["name"] } }
            } else if (filters.cuisine) {
                query = { "cuisine": filters["cuisine"] }
            } else if (filters.zipcode) {
                query = { "address.zipcode": filters["zipcode"] }
            }
        }

        let cursor: FindCursor<Document>;

        try {
            cursor = await restaurants.find(query);
        } catch (err) {
            console.error(`Unable to issue find command: ${err}`);
            return { restaurantsList: [], totalNumRestaurants: 0};
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants =  await restaurants.countDocuments(query);

            return { restaurantsList, totalNumRestaurants };
        } catch (err) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${err}`
            );
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }
}