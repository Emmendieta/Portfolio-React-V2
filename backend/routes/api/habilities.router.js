import habilitiesController from "../../controllers/habilities.controller.js";
import RouterHepler from "../../helpers/router.helper.js";

class HabilitesRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], habilitiesController.createHability);
        this.read("/", ["public"], habilitiesController.getAllHabilities);
        this.read("/:id", ["public"], habilitiesController.getHabilityById);
        this.read("/pag/paginate", ["public"], habilitiesController.getHabilitesPaginate);
        this.read("/filtOne/filter", ["public"], habilitiesController.getHabilityByFilter);
        this.read("/filt/filter", ["public"], habilitiesController.getHabilitiesByFilter);
        this.update("/:id", ["public"], habilitiesController.updateHabilityById);
        this.destroy("/:id", ["public"], habilitiesController.deleteHabilityById);
    };
};

const habilitiesRouter = (new HabilitesRouter()).getRouter();

export default habilitiesRouter;