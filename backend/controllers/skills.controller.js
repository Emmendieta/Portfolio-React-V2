import mongoose,  { isValidObjectId } from "mongoose";
import skillsService from "../services/skills.service.js";
import proyectsService from "../services/proyects.service.js";

class SkillsController {
    constructor() { 
        this.sService = skillsService; 
        this.pService = proyectsService;
    };

    createSkill = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            const files = req.files;
            const skillPath = "skills";
            if(!data || !data.name || !data.percent) throw new Error("Error: Missing information to creat the Skill!");
            data.name = JSON.parse(data.name);
            if(!files) throw new Error("Error: No image sent to upload!");
            let verify = await this.verifyName(data.name);
            if(verify === 1) throw new Error("Error: The name of the Skill alredy exist!");
            const totalElements = await this.sService.totalElements();
            data.order = totalElements + 1;
            const skill = await this.sService.createOneWithImages(data, files, skillPath, session)
            if(!skill) throw new Error("Error: Cound't create the Skill!");
            await session.commitTransaction();
            return res.json201(skill);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllSkills = async (req, res) => {
        try {
            const skills = await this.sService.readAll();
            if(!skills || skills.length === 0) return res.json404("Error: No Skills found!");
            return res.json200(skills);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getSkillsByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) return res.json400("Error: Filter is needed to get a Skill!");
            const skills = await this.sService.readByFilter(filter);
            if(!skills || skills.length === 0) return res.json404("Error: No Skills found!");
            return res.json200(skills);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getSkillById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) return res.json400("Error: The Id of the Skills is missing!");
            if(!isValidObjectId(id)) return res.json400("Error: Invalid Id!");
            const skill = await this.sService.readById(id);
            if(!skill) return res.json404("Error: Skill not found!");
            return res.json200(skill);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneSkillByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(!filter || filter.length === 0) return res.json400("Error: Filter is needen to get a Skill!");
            const skill = await this.sService.readOneByFilter(filter);
            if(!skill) return res.json404("Error: SKill not found!");
            return res.json200(skill);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateSocialMediaById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Skill!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Skill!");
            const data = req.body;
            if(!data) throw new Error("Error: Missing the information to update the Skill!");
            data.name = JSON.parse(data.name);
            const files = req.files;
            const skill = await this.sService.readById(id);
            if(!skill) throw new Error("Error: Skill not found!");
            let verify;
            if(data.name) {
                verify = await this.verifyName(data.name, id);
                if(verify === 1) throw new Error("Error: The name of the Skills alredy Exist!");
            };
            const folder = `skills/${id.toString()}`;
            const skillUpdated = await this.sService.updateOneWithImages(skill, data, files, folder, session);
            if(!skillUpdated) throw new Error("Error: Couldn't update the Skill!");
            await session.commitTransaction();
            return res.json200(skillUpdated);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    updateSkillsOrder = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("No ordered Skills was provided!");
            const socialsOrderUpdate = await this.sService.updateOrderDragDrop(data);
            if(!socialsOrderUpdate) return res.json500("Error in updating the order of the Socials!");
            await session.commitTransaction();
            return res.json200(socialsOrderUpdate);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteSkill = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: The Id is missing!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id!");
            const skill = await this.sService.readById(id);
            if(!skill) throw new Error("Error: Skill not found!");
            const skillObjectId = new mongoose.Types.ObjectId(id);
            const proyects = await this.pService.readByFilter({ skills: skillObjectId });
            if(proyects && proyects.length > 0) {
                for(const proyect of proyects) {
                    const skills = proyect.skills.filter(skill => skill._id.toString() !== id);
                    proyect.skills = skills;
                    await this.pService.updateById(proyect._id, proyect, { session });
                };
            };
            const folder = "skills";
            const deleteFolder = await this.sService.destroyFolder(id, folder);
            if(!deleteFolder) throw new Error("Error: Couldn't deleted the Folder from Cloudinary!");
            const skillDeleted = await this.sService.destroyById(id, { session });
            if(!skillDeleted) throw new Error("Error: Couldn't delete the Skill!");
            await this.sService.reorderAfterDelete(session);
            await session.commitTransaction();
            return res.json200(skillDeleted);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyName = async (name, id = null) => {
        const query = {
            'name.en': name?.en || name,
        };
        const verify = await this.sService.readOneByFilter(query);
        if(!verify) return 0;
        if(id && verify._id.toString() === id.toString()) return 0;
        return 1;
    };
};

const skillsController = new SkillsController();

export default skillsController;