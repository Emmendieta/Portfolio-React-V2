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
            if (!data) throw new Error("Error: Missing the information to create the Curriculum PDF!");
            const { 
                educations = [],
                works = [],
                skills = [],
                proyects = []
            } = data;
            let educationsData = [];
            let worksData = [];
            let skillsData = [];
            let proyectsData = [];
            if(educations.length > 0) { educationsData = await this.eduService.readByFilter({ _id: { $in: educations } }); }
            if(works.length > 0) { worksData = await this.workService.readByFilter({ _id: { $in: works } }); }
            if(skills.length > 0) { skillsData = await this.skillService.readByFilter({ _id: { $in: skills } }); }
            if(proyects.length > 0) { proyectsData = await this.proySerive.readByFilter({ _id: { $in: proyects } }); }
            console.log("CURRICULUM EDU", educationsData);
            console.log("CURRICULUM WORKS", worksData);
            console.log("CURRICULUM SKILLS", skillsData);
            console.log("CURRICULUM PROYECTS", proyectsData);
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const curriculumController = new CurriculumController();

export default curriculumController;