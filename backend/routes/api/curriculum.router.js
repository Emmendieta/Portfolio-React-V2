import curriculumController from "../../controllers/curriculum.controller.js";
import RouterHepler from "../../helpers/router.helper.js";

class CurriculumRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.read("/pdf", ["public"], curriculumController.createCurriculum);
    };
};

const curriculumRouter = (new CurriculumRouter()).getRouter();

export default curriculumRouter;