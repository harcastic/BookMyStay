import Listing from "../models/listing.js";
import Review from "../models/review.js";

const postReview = async(req , res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();

    console.log("review saved");
    req.flash("success", "Review added!");
    res.redirect(`/listings/${list._id}`);
};
export default postReview;

export const destroyReview = async( req, res )=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};