import ExpressError from './utils/ExpressError.js';
import wrapAsync from './utils/wrapAsync.js';
import { listSchema, revSchema } from "./schema.js";
import Listing from './models/listing.js';

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