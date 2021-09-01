import { Request, Response, Router} from 'express';
import RestaurantsController from './restaurants.controller';
const router = Router();

router.route('/').get(RestaurantsController.apiGetRestaurants)

export default router;