import continentsController from "../../controllers/continents.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class ContinentsRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], continentsController.createContinent);
        this.read("/", ["public"], continentsController.getAllContinents);
        this.read("/:id", ["public"], continentsController.getContinentById);
        this.read("/pag/paginate", ["public"], continentsController.getContinentesPaginePopulate);
        this.read("/search/paginate", ["public"], continentsController.getContinentesPaginePopulate);
        this.read("/filtOne/filter", ["public"], continentsController.getOneContinentByFilter);
        this.read("/all/populate", ["public"], continentsController.getAllContinentsPopulate);
        this.read("/:id/populate", ["public"], continentsController.getOneContinentByIdPopulate);
        this.read("/filt/filter", ["public"], continentsController.getContinentsByFilter);
        this.update("/:id", ["public"], continentsController.updateContinentById);
        this.destroy("/:id", ["public"], continentsController.deleteContinentById);
    };
};

const continentsRouter = (new ContinentsRouter()).getRouter();

export default continentsRouter;