import RouterHepler from "../helpers/router.helper.js";
import authRouter from "./api/auth.router.js";
import categoriesRouter from "./api/categories.router.js";
import citiesRouter from "./api/cities.router.js";
import skillsRouter from "./api/skills.router.js";
import provincesRouter from "./api/provinces.router.js";
import countriesRouter from "./api/countries.router.js";
import continentsRouter from "./api/continents.router.js";
import permissionsRouter from "./api/permissions.router.js";
import rolesRouter from "./api/roles.router.js";
import peopleRouter from "./api/people.router.js";
import usersRouter from "./api/users.router.js";
import responsibilitiesRouter from "./api/responsibilities.router.js";
import habilitiesRouter from "./api/habilities.router.js";
import educationsRouter from "./api/educations.router.js";
import proyectsRouter from "./api/proyects.router.js";
import worksRouter from "./api/works.router.js";
import socialsRouter from "./api/socials.router.js";

class ApiRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.use("/auth", authRouter);
        this.use("/people", peopleRouter);
        this.use("/users", usersRouter);
        this.use("/categories", categoriesRouter);
        this.use("/responsibilities", responsibilitiesRouter);
        this.use("/habilities", habilitiesRouter);
        this.use("/cities", citiesRouter);
        this.use("/provinces", provincesRouter);
        this.use("/countries", countriesRouter);
        this.use("/continents", continentsRouter);
        this.use("/permissions", permissionsRouter);
        this.use("/roles", rolesRouter);
        this.use("/skills", skillsRouter);
        this.use("/educations", educationsRouter);
        this.use("/proyects", proyectsRouter);
        this.use("/works", worksRouter);
        this.use("/socials", socialsRouter);
    };
};

const apiRouter = (new ApiRouter()).getRouter();

export default apiRouter;