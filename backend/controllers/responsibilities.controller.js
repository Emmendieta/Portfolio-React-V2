import mongoose, { isValidObjectId } from "mongoose";
import responsibilitiesService from "../services/responsibilities.service.js";
import worksService from "../services/works.service.js"
import proyectsService from "../services/proyects.service.js"
import { parseBracketQuery } from "../helpers/query.helper.js";

class ResponsibilitiesController {
    constructor() {
        this.rService = responsibilitiesService;
        this.wService = worksService;
        this.pService = proyectsService;
    };

    createResponsibility = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if(!data || !data.name) throw new Error("Error: Missing the information to create the responsibility!");
            const verify = await this.verifyName(data.name);
            if(verify === 1) throw new Error("Error: The name of the responsibility alredy exist!");
            const responsibility = await this.rService.createOne(data);
            if(!responsibility) throw new Error("Error: Couldn't create the responsibilty!");
            //await session.commitTransaction();
            return res.json201(responsibility);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllReponsibilities = async (req, res) => {
        try {
            const responsibilities = await this.rService.readAll();
            if(!responsibilities || responsibilities.length === 0) throw new Error("Error: Responsibilities not found!");
            return res.json200(responsibilities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getResponsibilitiesPaginate = async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = {} } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter", value => JSON.parse(value));
            const parsedSort = parseBracketQuery(req.query, "sort", Number);
            const responsibilities = await this.rService.readPaginate({ page: verifyPage, limit: verifyLimit, filter: parsedFilter, sort: parsedSort });
            if(!responsibilities || responsibilities.docs.length === 0) throw new Error("Error: Responsibilities not found!");
            return res.json200(responsibilities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getResponsibilitiesByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s of the responsibilities!");
            const responsibilities = await this.rService.readByFilter(filter);
            if(!responsibilities || responsibilities.length === 0) throw new Error("Error: Responsibilities not found!");
            return res.json200(responsibilities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getResponsibilityById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the responsibility!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the responsibility!");
            const responsibility = await this.rService.readById(id);
            if(!responsibility) throw new Error("Error: Responsibility not found!");
            return res.json200(responsibility);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getResponsibilityByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s of the responsibility!");
            const responsibility = await this.rService.readOneByFilter(filter);
            if(!responsibility) throw new Error("Error: Responsibility not found!");
            return res.json200(responsibility);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateResponsibilityById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the responsibility!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the responsibility!");
            const data = req.body;
            if(!data || !data.name) throw new Error("Error: Missing the information to update the responsibility!");
            const verify = await this.verifyName(data.name, id);
            if(verify === 1) throw new Error("Error: The name of the responsibility alredy exist!");
            const responsibility = await this.rService.readById(id);
            if(!responsibility) throw new Error("Error: Responsibity not found!");
            //const updatedResponsibility = await this.rService.updateById(id, data, { session });
            const updatedResponsibility = await this.rService.updateById(id, data);
            if(!updatedResponsibility) throw new Error("Error: Couldn't update the responsilibity!");
            //await session.commitTransaction();
            return res.json200(updatedResponsibility);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteResponsibilityById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the responsibility!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the responsibility!");
            const responsibility = await this.rService.readById(id);
            if(!responsibility) throw new Error("Error: Responsibility not found!");
            const responsibilityObjectId = new mongoose.Types.ObjectId(id);
            const works = await this.wService.readByFilter({ responsibilities : responsibilityObjectId });
            if(works && works.length > 0) {
                for(const work of works) {
                    const responsibilities = work.responsibilities.filter(responsibity => responsibility._id.toString() !== id);
                    work.responsibilities = responsibilities;
                    //await this.wService.updateById(work._id, work, { session });
                    await this.wService.updateById(work._id, work);
                };
            };
            const proyects = await this.pService.readByFilter({ responsibilities: responsibilityObjectId });
            if(proyects && proyects.length > 0) {
                for(const proyect of proyects) {
                    const responsibilities = proyect.responsibilities.filter(responsibility => responsibility._id.toString() !== id);
                    proyect.responsibilities = responsibilities;
                    //await this.pService.updateById(proyect._id, proyect, { session });
                    await this.pService.updateById(proyect._id, proyect);
                };
            };
            //const deletedResponsibility = await this.rService.destroyById(id, { session });
            const deletedResponsibility = await this.rService.destroyById(id);
            if(!deletedResponsibility) throw new Error("Error: Couldn't delete the responsibility!");
            //await session.commitTransaction();
            return res.json200(deletedResponsibility);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    verifyName = async (name, id = null) => {
        const query = {
            "name.en": name?.en || name,
        };
        const verify = await this.rService.readOneByFilter(query);
        if(!verify) return 0;
        if(id && verify._id.toString() === id.toString()) return 0;
        return 1;
    };
};

const responsibilitiesController = new ResponsibilitiesController();

export default responsibilitiesController;