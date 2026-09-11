import jwt from "jsonwebtoken";

class AuthController {
    registerCB = async (req, res) => {
        const { _id } = req.user;
        res.json201(_id, "Registered!");
    };

    loginCB = async (req, res) => {
        const user = req.user;
        const opts = {
            httpOnly: true,
            secure: true, // ⚠️ Ponelo en true si usás HTTPS
            sameSite: "none", // O "none" si usás HTTPS y querés compartir entre dominios ⚠️ Si usás sameSite: "none", secure debe estar en true y necesitás usar HTTPS. Para desarrollo local, mejor usar sameSite: "lax" y secure: false.
            maxAge: 24 * 60 * 60 * 1000
        };
        res.cookie("tokenPortfolioEmm", req.user.token, opts);
        const payload = jwt.decode(user.token);
        const safeUser = {
            _id: user._id,
            email: user.email,
            roles: user.roles?.role || null,
            permissions: payload.permissions,
            active: user.active
            
        };
        return res.json200(safeUser, "Logged in Success!");
    };

    signOutCB = async (req, res) => {
        res.clearCookie("tokenPortfolioEmm").json200(null, "Sign Out Success!");
    };

    badAuthCB = async (req, res) => res.json401();

    forbiddenCB = async (req, res) => res.json403();

    currentCB = async (req, res) => {
        if(!req.user) return res.status(401).json({
            method: req.method,
            url: req.originalUrl,
            response: null,
            error: true,
            message: "User not authenticated!"
        });
        return res.json200(req.user, "User is online!");
    };
};

const authController = new AuthController();

export default authController;