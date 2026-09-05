import multer from "multer";
import RouterHepler from "../../helpers/router.helper.js";
import worksController from "../../controllers/works.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class WorksRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), worksController.createWork);
        this.read("/", ["public"], worksController.getAllWorks);
        this.read("/:id", ["public"], worksController.getWorkById);
        this.read("/search/paginate", ["public"], worksController.getWorksPaginatePopulate);
        this.read("/filtOne/filter", ["public"], worksController.getWorkByFilter);
        this.read("/all/populate", ["public"], worksController.getAllWorksPopulate);
        this.read("/:id/populate", ["public"], worksController.getWorkByIdPopulate);
        this.read("/filt/filter", ["public"], worksController.getWorksByFilter);
        this.update("/:id", ["public"], upload.array("images"), worksController.updateWorkById);
        this.destroy("/:id", ["public"], worksController.deleteWorkById);
    };
};

const worksRouter = (new WorksRouter()).getRouter();

export default worksRouter;