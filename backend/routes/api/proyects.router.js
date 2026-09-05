import multer from "multer";
import RouterHepler from "../../helpers/router.helper.js";
import proyectsController from "../../controllers/proyects.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class ProyectsRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), proyectsController.createProyect);
        this.read("/", ["public"], proyectsController.getAllProyects);
        this.read("/:id", ["public"], proyectsController.getProyectById);
        this.read("/search/paginate", ["public"], proyectsController.getPoryectsPaginatePopulate);
        this.read("/filtOne/filter", ["public"], proyectsController.getProyectByFilter);
        this.read("/all/populate", ["public"], proyectsController.getAllProyectsPopulateFilter);
        this.read("/:id/populate", ["public"], proyectsController.getProyectByIdPopulate);
        this.read("/filt/filter", ["public"], proyectsController.getProyectByFilter);
        this.update("/:id", ["public"], upload.array("images"), proyectsController.updateProyectById);
        this.destroy("/:id", ["public"], proyectsController.deleteProyectById);
    };
};

const proyectsRouter = (new ProyectsRouter()).getRouter();

export default proyectsRouter;