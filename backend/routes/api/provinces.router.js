import provincesController from "../../controllers/provinces.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class ProvincesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], provincesController.createProvince);
        this.read("/", ["public"], provincesController.getAllProvinces);
        this.read("/:id", ["public"], provincesController.getOneProvinceById);
        this.read("/search/paginate", ["public"], provincesController.getProvincesPaginatePopulte);
        this.read("/filtOne/filter", ["public"], provincesController.getOneProvinceByFilter);
        this.read("/all/populate", ["public"], provincesController.getAllProvincesPopulate);
        this.read("/:id/populate", ["public"], provincesController.getOneProvinceByIdAndPopulate);
        this.read("/filt/filter", ["public"], provincesController.getProvincesByFilter);
        this.read("/all/filt/unassigned", ["public"], provincesController.getAllProvincesUnassigned);
        this.update("/:id", ["public"], provincesController.updateProvinceById);
        this.destroy("/:id", ["public"], provincesController.deleteProvinceById);
    };
};

const provincesRouter = (new ProvincesRouter()).getRouter();

export default provincesRouter;