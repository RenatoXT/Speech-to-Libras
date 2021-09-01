import { Request, Response, NextFunction } from "express";
import { IFilter } from "../models/filter.model";
import RestaurantsDao from '../dao/restaurants.dao';

export default class RestaurantsController {
    static async apiGetRestaurants( req: Request, resp: Response, next: NextFunction) {
        const _restaurantsPerPage  = req.query.restaurantsPerPage || '';
        const _page  = req.query.page || '';
        const _cuisine  = req.query.cuisine?.toString() || '';
        const _zipcode  = req.query.zipcode?.toString() || '';
        const _name  = req.query.name?.toString() || '';
        


        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(_restaurantsPerPage.toString(), 10) : 20;
        const page = req.query.page ? parseInt(_page.toString(), 10) : 0;

        let filters: IFilter = {
            cuisine: _cuisine,
            zipcode: _zipcode,
            name: _name,
        };

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDao.getRestaurants( filters, page, restaurantsPerPage, );
        
        let response = {
            restaurants: restaurantsList,
            page,
            filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        };
        
        resp.json(response);
    }

    static async apiGetRestaurantsById(req: Request, resp: Response, next: NextFunction) {
        try {
            const _id = req.params.id || '';
            const restaurant = await RestaurantsDao.getRestaurantByID(_id);

            if (!restaurant) {
                resp.status(404).json({ error: "Not Found" });
                return ;
            }

            resp.json(restaurant);
        } catch (err) {
            console.log(`api, ${err}`);
            resp.status(500).json({ error: err });
        }
    }

    static async apiGetRestaurantCuisines(req: Request, resp: Response, next: NextFunction) {
        try {
            const cuisines = await RestaurantsDao.getCuisines();

            if (!cuisines) {
                resp.status(404).json({ error: "Not Found" });
                return ;
            }

            resp.json(cuisines);
        } catch (err) {
            console.log(`api, ${err}`);
            resp.status(500).json({ error: err });
        }
    }
}