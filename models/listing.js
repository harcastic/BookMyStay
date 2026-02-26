import mongoose from "mongoose";
import Review from "./review.js";
// import { listingSchema } from "../schema";

const Schema = mongoose.Schema;

const ListingSchema  = new Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    image : {
        filename: String,
        url: String,
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref : "Review" 
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

ListingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);
export default  Listing;