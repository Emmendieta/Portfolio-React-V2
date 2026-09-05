import countriesController from "../../controllers/countries.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class CountriesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], countriesController.createCountry);
        this.read("/", ["public"], countriesController.getAllCountries);
        this.read("/:id", ["public"], countriesController.getOneCountryById);
        this.read("/search/paginate", ["public"], countriesController.getAllCountriesPaginatePopulate);
        this.read("/filtOne/filter", ["public"], countriesController.getOneCountryByFilter);
        this.read("/all/populate", ["public"], countriesController.getAllCountriesPopulate);
        this.read("/:id/populate", ["public"], countriesController.getOneCountryPopulateById);
        this.read("/filt/filter", ["public"], countriesController.getCountriesByFilter);
        this.read("/all/filt/unassigned", ["public"], countriesController.getAllCountriesUnassinged);
        this.update("/:id", ["public"], countriesController.updateCountryById);
        this.destroy("/:id", ["public"], countriesController.deleteCountryById);
    };
};

const countriesRouter = (new CountriesRouter()).getRouter();

export default countriesRouter;