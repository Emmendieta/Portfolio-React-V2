import curriculumService from "../services/curriculum.service.js";
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
        this.curriService = curriculumService;
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
            let populateFields = [];
            if(educations.length > 0) {
                populateFields = ["habilities"];
                for (const edu of educations) {
                    const educationResponse = await this.eduService.readByIdAndPopulate(edu, populateFields);
                    if(!educationResponse) throw new Error("Error: Couldn't get the education to create the PDF!");
                    educationsData.push(educationResponse);
                };
                populateFields = [];
            };
            if(works.length > 0) { 
                populateFields = ["responsibilities"];
                for (const work of works) {
                    const worksResponse = await this.workService.readByIdAndPopulate(work, populateFields);
                    if(!worksResponse) throw new Error("Error: Couldn't get the work to create the PDF!");
                    worksData.push(worksResponse);
                };
                populateFields = [];
            };
            if(skills.length > 0) { skillsData = await this.skillService.readByFilter({ _id: { $in: skills } }); }
            if(proyects.length > 0) { 
                populateFields = ["skills", "categories", "responsibilities"];
                for (const proyect of proyects) {
                    const proyectResponse = await this.proySerive.readByIdAndPopulate(proyect, populateFields);
                    if(!proyectResponse) throw new Error("Error: Couldn't get the proyect to create the PDF!");
                    proyectsData.push(proyectResponse);
                };
                populateFields = [];
            };
            populateFields = ["people", "people.continents", "people.countries", "people.provinces", "people.cities", "roles", "roles.permissions", "extraPermission"];
            const users = await this.userService.readAllAndPopulate(populateFields);
            if(!users || users.length === 0) throw new Error("Error: Couldn't get the users!");
            const user = users[0];
            const curriculumData = { user, educations: educationsData, works: worksData, skills: skillsData, proyects: proyectsData };
            const pdfBuffer = await this.curriService.generatePDF(curriculumData);
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition":
                    'attachment; filename="Curriculum-Mendieta-Emiliano-Manuel.pdf"',
                "Content-Length": pdfBuffer.length
            });
            return res.send(pdfBuffer);
        } catch (error) {
            return res.statu(500).json({message: `Error: ${error.message}`});
        }
    };
};

const curriculumController = new CurriculumController();

export default curriculumController;