import ExpressError from './utils/ExpressError.js';
import { listSchema, revSchema } from "./schema.js";
import Listing from './models/listing.js';
import Review from './models/review.js';

const isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "User not login!");  
        return res.redirect("/login");
    }
    next();
}
export default isLoggedin;

export const redirectURL = (req, res, next)=>{

    if( req.session.redirectURL){
        res.locals.redirectRoute = req.session.redirectURL;
    }
    next();
}


export const isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You're not authorized to perfrom this action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//Server-side validation
export const validateListing = ( req, res, next )=>{
    let { error } = listSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError( 400,  errMsg);
    }else{
        next();
    }
}

//Server-Side Validation
export const validateReview = (req, res , next )=>{
    let { error } = revSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, msg);   
    }else{
        next();
    }
}

//isAuthor 
export const isAuthor = async (req, res, next) =>{
    let {id, reviewId} = req.params;
    let revId = await Review.findById(reviewId);
    if(!revId.author.equals(res.locals.currUser._id)){
        req.flash("error", "You're not authorized to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}