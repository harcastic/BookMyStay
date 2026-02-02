import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { listSchema, revSchema } from "../schema.js";
import Listing from '../models/listing.js';
const router = express.Router();


//Server-side validation
const validateListing = ( req, res, next )=>{
    let { error } = listSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError( 400,  errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync( async (req, res) => {
  console.log("Fetching listings...");
  const allListings = await Listing.find({});
  console.log("Got listings:", allListings.length);
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", (req, res)=>{
    res.render("listings/new");
})

//Create Route
router.post("/", validateListing,  wrapAsync( async (req,res, next)=>{
        const {title, description, image, price , location, country} = req.body.listing;
        // store image as an object consistent with the schema
        let newListing = new Listing({title, description, image: { url: image }, price , location, country});
        await newListing.save();
        console.log(newListing);
        res.redirect("/listings");
    }
)); 

//Show Route
router.get("/:id", wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews");
    res.render("listings/show", {listing});
}))

//Edit Route
router.get("/:id/edit", validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit",{listing});
}))

//update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const { title, description, image, price, location, country } = req.body.listing;
    const updateData = { title, description, price, location, country };

    if (image) {
      updateData.image = { url: image };
    }

    await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    console.log(req.body);
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings'); 
}))


export default router;