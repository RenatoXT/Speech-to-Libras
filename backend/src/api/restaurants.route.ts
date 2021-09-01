import { Router} from 'express';
import RestaurantsController from './restaurants.controller';
import ReviewsController from './reviews.controller';
const router = Router();

router.route('/').get(RestaurantsController.apiGetRestaurants)

router.route('/review')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

export default router;