import dotenv from "dotenv";
dotenv.config();

import upload from '../cloudConfig.js';
import express from 'express';
import wrapAsync from '../utils/wrapAsync.js'; 
import { validateListing } from '../middleware.js';
import index, { createListing, destroyListing, editListing, newFrom, showListing, updateListing } from '../controllers/listingsController.js';

// const upload = multer({storage});
const router = express.Router();
import isLoggedin, { isOwner }  from '../middleware.js';


//Index Route
router.get("/", wrapAsync(index));

//New Route
router.get("/new", isLoggedin, newFrom);

//Create Route
router.post("/", isLoggedin, validateListing, (req, res, next) => { 
    console.log("=== UPLOAD REQUEST ===");
    console.log("Body before upload:", req.body);
    
    upload.single("listing[image]")(req, res, (err) => {
        console.log("After upload - File:", req.file);
        console.log("After upload - Body:", req.body);
        
        if (err) {
            console.error("Upload error:", err);
            req.flash("error", "Image upload error: " + err.message);
            return res.redirect("/listings/new");
        }
        next();
    });
},  wrapAsync(createListing)); 

//Show Route
router.get("/:id", wrapAsync( showListing));

//Edit Route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(editListing));

//update Route
router.put("/:id", validateListing, isLoggedin, isOwner, (req, res, next)=>{
    upload.single("listing[image]")(req, res, (err) => {
        console.log("After Edit - File:", req.file);
        console.log("After Edit - Body:", req.body);
        
        if (err) {
            console.error("Upload error:", err);
            req.flash("error", "Image upload error: " + err.message);
            return res.redirect("/listings/new");
        }
        next();
    });
    
},wrapAsync(updateListing));

//Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(destroyListing));

export default router;