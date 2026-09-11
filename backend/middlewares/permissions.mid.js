import jwt from "jsonwebtoken";
import populateUser from "../helpers/populateUser.helper.js";

export const requiredPermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.token;
            if(!token) return res.json401("Not authenticated!");
            const decoded = jwt.verify(token, process.env.SECRET);
            const user = await populateUser(decoded.user_id);
            if(!user) return res.json401("User not found!");
            const rolePermissions = user.roles?.flatMap(role => role.permissions || []).map(p => p.key);
            const extraPermissions = user.extraPermission?.map(p => p.key) || [];
            const allPermissions = [...new Set([...(rolePermissions || []), ...extraPermissions])];
            if(!allPermissions.includes(permissionKey)) return res.json403(`Forbidden: Missing permission ${permissionKey}`);
            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    }
};