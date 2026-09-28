import educationsService from "../services/educations.service.js";
import proyectsService from "../services/proyects.service.js";
import skillsService from "../services/skills.service.js";
import usersService from "../services/users.service.js";
import worksService from "../services/works.service.js";

class CurriculumController {
    constructor() {
        this.workService = worksService;
        this.eduService = educationsService;
        this.skillService = skillsService;
        this.proySerive = proyectsService;
        this.userService = usersService;
    };

    createCurriculum = async (req, res) => {
        try {
            const data = req.body;
            //console.log("CONTOLLER CURRICULUM", data);
            console.log(
                "CONTROLLER CURRICULUM:",
                JSON.stringify(req.body, null, 2)
            );

            console.log("EDUCATIONS:", req.body.educations);
            console.log("WORKS:", req.body.works);
            console.log("SKILLS:", req.body.skills);
            console.log("PROYECTS:", req.body.proyects);
            if (!data) throw new Error("Error: Missing the information to create the Curriculum PDF!");

        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const curriculumController = new CurriculumController();

export default curriculumController;