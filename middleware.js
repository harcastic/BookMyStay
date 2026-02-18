const isLoggedin = (req, res, next) => {
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "User not login!");  
        return res.redirect("/login");
    }
    next();
}

export const redirectURL = (req, res, next)=>{

    if( req.session.redirectURL){
        res.locals.redirectRoute = req.session.redirectURL;
    }
    next();
}
// export  redirectURL;
export default isLoggedin;