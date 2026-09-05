import responsibilitiesController from "../../controllers/responsibilities.controller.js";
import RouterHepler from "../../helpers/router.helper.js";

class ResponsibilitiesRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], responsibilitiesController.createResponsibility);
        this.read("/", ["public"], responsibilitiesController.getAllReponsibilities);
        this.read("/:id", ["public"], responsibilitiesController.getResponsibilityById);
        this.read("/pag/paginate", ["public"], responsibilitiesController.getResponsibilitiesPaginate);
        this.read("/all/populate", ["public"], responsibilitiesController.getResponsibilitiesPaginate);
        this.read("/filtOne/filter", ["public"], responsibilitiesController.getResponsibilityByFilter);
        this.read("/filt/filter", ["public"], responsibilitiesController.getResponsibilitiesByFilter)
        this.update("/:id", ["public"], responsibilitiesController.updateResponsibilityById);
        this.destroy("/:id", ["public"],responsibilitiesController.deleteResponsibilityById);
    };
};

const responsibilitiesRouter = (new ResponsibilitiesRouter()).getRouter();

export default responsibilitiesRouter;