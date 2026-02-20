import mongoose from "mongoose";
import Review from "./review.js";
// import { listingSchema } from "../schema";

const Schema = mongoose.Schema;
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1711743266323-5badf42d4797?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjBleHRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000";

const ListingSchema  = new Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    image : {
        filename: String,
        url: {
            type: String,
            default: DEFAULT_IMAGE,
            set: (v) => (v === "" ? DEFAULT_IMAGE : v),
        },
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