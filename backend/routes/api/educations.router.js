import multer from "multer";
import RouterHepler from "../../helpers/router.helper.js";
import educationsController from "../../controllers/educations.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class EducationsRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), educationsController.createEducation);
        this.read("/", ["public"], educationsController.getAllEducations);
        this.read("/:id", ["public"], educationsController.getEducationById);
        this.read("/search/paginate", ["public"], educationsController.getEducationsPaginatePopulate);
        this.read("/filtOne/filter", ["public"], educationsController.getEducationByFilter);
        this.read("/all/populate", ["public"], educationsController.getAllEducationsPopulate);
        this.read("/:id/populate", ["public"], educationsController.getEducationByIdPopulate);
        this.read("/filt/filter", ["public"], educationsController.getEducaciontsByFilter);
        this.update("/:id", ["public"], upload.array("images"), educationsController.updateEducationById);
        this.destroy("/:id", ["public"], educationsController.deleteEducationById);
    };
};

const educationsRouter = (new EducationsRouter()).getRouter();

export default educationsRouter;