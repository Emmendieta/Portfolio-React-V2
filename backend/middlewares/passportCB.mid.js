import passport from "./passport.mid.js";

const passportCB = (strategy) => async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
        if(error) return next(error);
        if(!user) return res.json401(info?.message || "Unauthorized!!!");
        req.user = user;
        next();
    }) (req, res, next);
};

export default passportCB;