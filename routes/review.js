import express from 'express';
const router = express.Router({mergeParams : true});
import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { revSchema } from "../schema.js";
import Review from '../models/review.js';
import Listing from '../models/listing.js';

//Server-Side Validation
const validateReview = (req, res , next )=>{
    let { error } = revSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, msg);   
    }else{
        next();
    }
}


//Post Review Route
router.post("/", validateReview, wrapAsync(async(req , res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();

    console.log("review saved");
    req.flash("success", "Review added!");
    res.redirect(`/listings/${list._id}`);
}));

//Review Delete route
router.delete("/:reviewId", wrapAsync(async( req, res )=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));

export default router;