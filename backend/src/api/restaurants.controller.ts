import { Request, Response, NextFunction } from "express";
import { IFilter } from "../../models/filter.model";
import RestaurantsDao from "../dao/restaurants.dao";

export default class RestaurantsController {
    static async apiGetRestaurants( req: Request, resp: Response, next: NextFunction) {
        const _restaurantsPerPage  = req.query.restaurantsPerPage?.toString() || '';
        const _page  = req.query.page?.toString() || '';
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
}