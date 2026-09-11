import authController from "../../controllers/auth.controller.js";
import RouterHepler from "../../helpers/router.helper.js";
import passportCB from "../../middlewares/passportCB.mid.js";

class AuthRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.create("/register", ["public"], passportCB("register"), authController.registerCB);
        this.create("/login", ["public"], passportCB("login"), authController.loginCB);
        this.create("/signout", ["public"], authController.signOutCB);
        this.read("/current", ["public"], passportCB("current"), authController.currentCB);
        this.read("/bad-auth", ["public"], authController.badAuthCB);
        this.read("/forbidden", ["public"], authController.badAuthCB);
    };
};

const authRouter = (new AuthRouter()).getRouter();

export default authRouter;