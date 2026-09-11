import { usersRepository } from "../repositories/repository.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as PassportStrategy } from "passport-jwt";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
import populateUser from "../helpers/populateUser.helper.js";
import { getPermissionScopeList } from "../helpers/permissions.helper.js";

passport.use(
    "register",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, ElementInternals, tokenPassword, done) => {
            try {
                if(!req.body.firstName || !req.body.lastName) return done(null, null, { message: "Invalid Data!", statusCode: 400 });
                let user = await usersRepository.readByFilter({ email });
                if(user) return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                req.body.password = createHash(password);
                user = await usersRepository.createOne(req.body);
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                let user = await usersRepository.readOneByFilter({ email });
                if(!user) return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                const verifyPassword = compareHash(password, user.password);
                if(!verifyPassword) return done(null, null, { message: "Invalid Credentials!", statusCode: 401 });
                user = await populateUser(user._id);
                const permissionsScope = getPermissionScopeList(user);
                const data = { user_id: user._id, email: user.email, permissions: permissionsScope };
                const token = createToken(data);
                user.token = token;
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        req => req?.cookies?.tokenPortfolioEmm
    ]),
    secretOrKey: process.env.SECRET
};

passport.use(
    "current",
    new PassportStrategy(jwtOptions, async (payload, done) => {
        try {
            if(!payload || !payload.user_id) return done(null, null, { message: "Forbidden!", statusCode: 403 });
            return done(null, payload);
        } catch (error) {
            done(error);
        }
    })
);

passport.use(
    "jwt",
    new PassportStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await populateUser(payload.user_id);
            if(!user) return done(null, null, { message: "Forbidden!", statusCode: 403 });
            done(null, user);
        } catch (error) {
            done(error);
        }
    })
);

export default passport;