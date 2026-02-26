import User from "../models/user.js";

const singUp = (req, res)=>{
    res.render("users/signup.ejs");
};
export default singUp;

export const postSignUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to BookMyStay");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

export const loginRoute = (req, res)=>{
    res.render("users/login.ejs");
};

export const postLogin = async(req,res)=>{
    req.flash("success" , "Welcome to BookMyStay"); 
    let redirectRoute = res.locals.redirectRoute || "/listings";
    res.redirect(redirectRoute);
};

export const getLogout  = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    })
};