import express from 'express';
import wrapAsync from '../utils/wrapAsync.js'; 
import Listing from '../models/listing.js';
import { validateListing } from '../middleware.js';

const router = express.Router();
import isLoggedin, { isOwner }  from '../middleware.js';



//Index Route
router.get("/", wrapAsync( async (req, res) => {
  console.log("Fetching listings...");
  const allListings = await Listing.find({});
  console.log("Got listings:", allListings.length);
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedin, (req, res)=>{
    res.render("listings/new.ejs");
})

//Create Route
router.post("/", validateListing, isLoggedin, wrapAsync( async (req,res, next)=>{
        const {title, description, image, price , location, country} = req.body.listing;
        // store image as an object consistent with the schema
        let newListing = new Listing({title, description, image: { url: image }, price , location, country});
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        console.log(newListing);
        res.redirect("/listings");
    }
)); 

//Show Route
router.get("/:id", wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");  
    }
    res.render("listings/show", {listing});
}))

//Edit Route
router.get("/:id/edit", validateListing, isLoggedin, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id); 
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");  
    }
    res.render("listings/edit",{listing});
}))

//update Route
router.put("/:id", validateListing, isLoggedin, isOwner, wrapAsync(async (req, res) => {
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
    req.flash("success", "Listing details updated!");
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect('/listings'); 
}))


export default router;