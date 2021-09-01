import { Router} from 'express';
import RestaurantsController from './restaurants.controller';
import ReviewsController from './reviews.controller';
const router = Router();

router.route('/').get(RestaurantsController.apiGetRestaurants)
router.route('/id/:id').get(RestaurantsController.apiGetRestaurantsById)
router.route('/cuisines').get(RestaurantsController.apiGetRestaurantCuisines)

router.route('/review')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

export default router;