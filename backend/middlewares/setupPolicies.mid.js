/**
 * setupPolicies: Middleware dinámico para validar roles de usuario
 * @param {Array<string>} policies - lista de roles permitidos (ej: ["admin", "user", "client"])
 */


import { verifyToken } from "../helpers/token.helper.js";
import populateUser from "../helpers/populateUser.helper.js";
import { isValidObjectId } from "mongoose";

const setupPolicies = (policies = []) => async (req, res, next) => {
    try {
        if(policies.includes("public")) return next();
        const token = req?.cookies?.token;
        if(!token) return res.json401("Unauuthoried!!!");
        const data = verifyToken(token);
        const { user_id } = data;
        if(!isValidObjectId(user_id)) return res.json401("Invalid User Id!");
        const user = await populateUser(user_id);
        if(!user) return res.json404("User not found!");
        const userRoleKeys = Object.values(user.roles?.role || {});
        const roleAllowed = userRoleKeys.some(role => policies.includes(role));
        if(!roleAllowed) return res.json403("Forbidden! Role not allowed!");
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default setupPolicies;