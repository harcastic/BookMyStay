import mongoose from "mongoose";
import pkg from "passport-local-mongoose";

const passportLocalMongoose = pkg.default || pkg;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
export default User;