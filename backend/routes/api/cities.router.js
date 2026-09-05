import citiesController from "../../controllers/cities.controller.js";
import RouterHelper from "../../helpers/router.helper.js";
import { requiredPermission } from "../../middlewares/permissions.mid.js";

class CitiesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        //this.create("/", ["public"], requirePermission('permission.create_one_city'), citiesController.createCity);
        this.create("/", ["public"], citiesController.createCity);
        //this.read("/", ["public"], requirePermission('permission.read_all_cities'), citiesController.getAllCities);
        this.read("/", ["public"], citiesController.getAllCities);
        //this.read("/:id", ["public"], requirePermission('permission.read_one_city'), citiesController.getCityById);
        this.read("/:id", ["public"], citiesController.getCityById);
        this.read("/pag/paginate", ["public"], citiesController.getCitiesPaginate);
        this.read("/filtOne/filter", ["public"], citiesController.getCityByFilter);
        this.read("/filt/filter", ["public"], citiesController.getCitiesByFilter);
        this.read("/all/filt/unassigned", ["public"], citiesController.getAllCitiesUnassigned);
        //this.update("/:id", ["public"], requirePermission('permission.update_one_city'), citiesController.updateCityById);
        this.update("/:id", ["public"], citiesController.updateCityById);
        //this.destroy("/:id", ["public"], requirePermission('permission.delete_one_city'), citiesController.deleteCityById);
        this.destroy("/:id", ["public"], citiesController.deleteCityById)
    };
};

const citiesRouter = (new CitiesRouter()).getRouter();

export default citiesRouter;