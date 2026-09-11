import multer from "multer";
import peopleController from "../../controllers/people.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

//Configuracion Multer:
const storage = multer.memoryStorage();
const upload = multer({ storage });

class PeopleRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), peopleController.createPersonWithImages);
        this.read("/", ["public"], peopleController.getPeople);
        this.read("/:id", ["public"], peopleController.getOnePersonById);
        this.read("/search/paginate", ["public"], peopleController.getPeoplePaginatePopulate);
        this.read("/filtOne/filter", ["public"], peopleController.getPersonByFilter);
        this.read("/all/populate", ["public"], peopleController.getPeoplePopulate);
        this.read("/:id/populate", ["public"], peopleController.getPersonByIdPopulate);
        this.read("/filt/filter", ["public"], peopleController.getPeopleByFilter);
        this.update("/:id", ["public"], upload.array("images"), peopleController.updatePersonById);
        this.destroy("/:id", ["public"], peopleController.deletePersonById);
    };
};

const peopleRouter = (new PeopleRouter()).getRouter();

export default peopleRouter;