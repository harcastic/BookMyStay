import Listing from "../models/listing.js";

const index = async (req, res) => {
  console.log("Fetching listings...");
  const allListings = await Listing.find({});
  console.log("Got listings:", allListings.length);
  res.render("listings/index.ejs", { allListings });
};
export default index;

export const newFrom = (req, res)=>{
    res.render("listings/new.ejs");
};

export const createListing = async (req,res, next)=>{
    try {
        console.log("=== CREATE LISTING ===");
        console.log("User:", req.user ? req.user._id : "NOT AUTHENTICATED");
        console.log("Body:", req.body);
        console.log("File:", req.file);
        
        const {title, description, price , location, country} = req.body.listing;
        
        // Check if file was uploaded
        if (!req.file) {
            console.log("ERROR: No file uploaded");
            req.flash("error", "Please upload an image");
            return res.redirect("/listings/new");
        }
        
        console.log("Creating listing with:", {title, description, price, location, country});
        console.log("Image URL:", req.file.path);
        
        let url = req.file.path;
        let filename = req.file.filename;
        // store image as an object consistent with the schema
        let newListing = new Listing({
            title, 
            description, 
            price, 
            location, 
            country,
            image: { 
                url: req.file.path, 
                filename: req.file.filename 
            }
        });
        
        newListing.owner = req.user._id;
        newListing.image = {url , filename};
        await newListing.save();
        
        req.flash("success", "New Listing Created!");
        console.log("✓ Listing created successfully:", newListing._id);
        res.redirect("/listings");
    } catch (err) {
        console.error("✗ Error in createListing:");
        console.error("  Message:", err.message);
        console.error("  Name:", err.name);
        console.error("  Stack:", err.stack);
        req.flash("error", "Failed to create listing: " + err.message);
        res.redirect("/listings/new");
    }
};

export const showListing = async (req, res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate({path : "reviews", populate :{path :"author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");  
    }
    res.render("listings/show", {listing});
}

export const editListing = async (req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id); 
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");  
    }
    let originalImageUrl = "";
    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace(
            "/upload",
            "/upload/w_250/e_blur:50"
        );
    }
    res.render("listings/edit",{listing, originalImageUrl});
};

export const updateListing = async (req, res) => {
    const {id} = req.params;
    
    const { title, description,  price, location, country, image } = req.body.listing;
    const updateData = { title, description, price, location, country, image };

    if (typeof req.file !== "undefined") {
        let url =  req.file.path;
        let filename = req.file.filename;
        updateData.image = {url , filename};
        // await Listing.save();
    }
    await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    console.log(req.body);
    req.flash("success", "Listing details updated!");
    res.redirect(`/listings/${id}`);
};

export const destroyListing  = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect('/listings'); 
};