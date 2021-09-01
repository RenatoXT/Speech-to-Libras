import { Request, Response, NextFunction, response } from "express";
import { InsertOneResult } from "mongodb";
import ReviewsDAO from '../dao/reviews.dao'
import { IUser } from '../models/user.model';

export default class ReviewsController {

    static async apiPostReview(req: Request, resp: Response, next: NextFunction) {

        try {
            const _restaurantId = req.body?.restaurant_id;
            const _review = req.body.text;
            const _userInfo: IUser = {
                name: req.body.name,
                _id: req.body.user_id
            };

            const date = new Date();

            const ReviewResponse: any = await ReviewsDAO.addReview(
                _restaurantId,
                _userInfo,
                _review,
                date,
            );

            if (ReviewResponse.acknowledged) {
                resp.status(202).json({ status: "success"});
            } else {
                throw new Error(ReviewResponse)
            }

        } catch (err) {
            let message = (err as Error ).message;
            resp.status(500).json({ error: message})
        }
        
    }

    static async apiUpdateReview(req: Request, resp: Response, next: NextFunction) {
        try {
            const _userId = req.body.user_id;
            const _reviewId = req.body.review_id;
            const _text = req.body.text;
            
            const date = new Date();

            const reviewResponse: any = await ReviewsDAO.updateReview(
                _reviewId,
                _userId,
                _text,
                date
            );

            const { error, modifiedCount } = reviewResponse;

            if (error) {
                resp.status(400).json({ error });
            };

            if ( modifiedCount === 0) {
                throw new Error(
                    `Unable to update review - user may not be original poster`
                )
            };

            resp.status(200).json({ status: "success"});

        } catch (err) {
            let message = (err as Error ).message;
            resp.status(500).json({ error: message})
        }
    }

    static async apiDeleteReview(req: Request, resp: Response, next: NextFunction) {
        try {
            const _userId = req.query.id?.toString() || '';
            const _reviewId = req.query.user_id?.toString() || '' ;

            const reviewResponse = await ReviewsDAO.deleteReview(
                _reviewId,
                _userId,
            );

            resp.status(200).json({ status: "success"});
        } catch (err) {
            let message = (err as Error ).message;
            resp.status(500).json({ error: message})
        }
    }
}