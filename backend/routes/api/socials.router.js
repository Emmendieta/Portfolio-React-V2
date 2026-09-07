import multer from "multer";
import RouterHepler from "../../helpers/router.helper.js";
import socialsController from "../../controllers/socials.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class SocialsRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), socialsController.createSocial);
        this.read("/", ["public"], socialsController.getAllSocial);
        this.read("/:id", ["public"], socialsController.getSocialById);
        this.read("/filtOne/filter", ["public"], socialsController.getSocialByFilter);
        this.read("/filt/filter", ["public"], socialsController.getSocialsByFilter);
        this.update("/reorder", ["public"], socialsController.updateSocialsOrder);
        this.update("/:id", ["public"], upload.array("images"), socialsController.updateSocialById);
        this.destroy("/:id", ["public"], socialsController.deleteSocialById);
    };
};

const socialsRouter = (new SocialsRouter()).getRouter();

export default socialsRouter;