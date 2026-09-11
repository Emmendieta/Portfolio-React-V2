import RouterHepler from "../../helpers/router.helper.js";
import skillsController from "../../controllers/skills.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class SkillsRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.create("/", ["public"], upload.array("images"), skillsController.createSkill);
        this.read("/", ["public"], skillsController.getAllSkills);
        this.read("/:id", ["public"], skillsController.getSkillById);
        this.read("/filtOne/filter", ["public"], skillsController.getOneSkillByFilter);
        this.read("/filt/filter", ["public"], skillsController.getSkillsByFilter);
        this.update("/reorder", ["public"], skillsController.updateSkillsOrder);
        this.update("/:id", ["public"], upload.array("images"), skillsController.updateSocialMediaById);
        this.destroy("/:id", ["public"], skillsController.deleteSkill);
    };
};

const skillsRouter = (new SkillsRouter()).getRouter();

export default skillsRouter;