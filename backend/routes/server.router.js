import RouterHepler from "../helpers/router.helper.js";
import apiRouter from "./api.router.js";

class ServerRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.use("/", apiRouter);
    };
};

const serverRouter = (new ServerRouter()).getRouter();

export default serverRouter;