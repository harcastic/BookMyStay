import express from 'express';
const router = express.Router({mergeParams : true});
import wrapAsync from '../utils/wrapAsync.js';
import isLoggedin, { isAuthor, validateReview } from '../middleware.js';
import postReview, { destroyReview } from '../controllers/reviewController.js';


//Post Review Route
router.post("/", isLoggedin, validateReview, wrapAsync(postReview));

//Review Delete route
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(destroyReview));

export default router;