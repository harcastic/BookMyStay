import express from 'express';
const router = express.Router({mergeParams : true});
import wrapAsync from '../utils/wrapAsync.js';
import isLoggedin, { isAuthor, isOwner, validateReview } from '../middleware.js';
import Review from '../models/review.js';
import Listing from '../models/listing.js';




//Post Review Route
router.post("/", isLoggedin, validateReview, wrapAsync(async(req , res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();

    console.log("review saved");
    req.flash("success", "Review added!");
    res.redirect(`/listings/${list._id}`);
}));

//Review Delete route
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(async( req, res )=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));

export default router;