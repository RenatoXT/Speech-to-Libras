import { Collection, Document, Filter, FindCursor, MongoClient, ObjectId } from 'mongodb';
import { IFilter } from '../models/filter.model';

let restaurants: Collection<Document>;

export default class RestaurantsDao {
    static async injectDB(conn: MongoClient) {
        if (restaurants) {
            return 
        } 

        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch( err) {
            console.error( `Unable to estabilish a collection handle in restaurantsDAO: ${err}` );
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
            console.error( `Unable to convert cursor to array or problem counting documents, ${err}` );
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }
    
    static async getRestaurantByID( id: string ) {
        try { 
            const pipeline = [
                { $match : { _id: new ObjectId(id) }},
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ];

            return await restaurants.aggregate(pipeline).next();
        } catch (err) {
            console.error( `Something went wrong in getRestaurantByID, ${err}` );
            throw err;
        }
    }

    static async getCuisines() {
        let cuisines = [];

        try {
            cuisines = await restaurants.distinct('cuisine');
            return cuisines;
        } catch (err) {
            console.error(`Unable to get cuisines, ${err}`);
            return cuisines;
        }
    }
}