import mongoose, { isValidObjectId } from "mongoose";
import proyectsService from "../services/proyects.service.js";
import responsibilitiesService from "../services/responsibilities.service.js";
import { buildMatchStages, parseBracketQuery, parsePopulateQuery } from "../helpers/query.helper.js";
import { lookup } from "../helpers/lookup.helper.js";

class ProyectsController {
    constructor() {
        this.pService = proyectsService;
        this.rService = responsibilitiesService;
    };

    createProyect = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            const files = req.files || [];
            const proyectsPath = "proyects";
            if (!data || !data.name || !data.dateStart || !data.company || !data.linkProyect) throw new Error("Error: Missing the information to create the proyect!");
            if (data.dateEnd === "" || data.dateEnd === "null" || data.dateEnd === null) data.dateEnd = null;
            if (data.name) data.name = JSON.parse(data.name);
            if (data.company) data.company = JSON.parse(data.company);
            if (data.description) data.description = JSON.parse(data.description);
            if (data.categories) data.categories = JSON.parse(data.categories);
            if (data.responsibilities) data.responsibilities = JSON.parse(data.responsibilities);
            if (data.skills) data.skills = JSON.parse(data.skills);
            const verifiy = await this.verifyNameProyect(data.name);
            if (verifiy === 1) throw new Error("Error: The name of the proyect alredy Exist!");
            const totalElements = await this.pService.totalElements();
            data.order = totalElements  + 1;
            //const proyect = await this.pService.createOneWithImages(data, files, proyectsPath, session);
            const proyect = await this.pService.createOneWithImages(data, files, proyectsPath);
            if (!proyect) throw new Error("Error: Couldn't create the proyect!");
            //await session.commitTransaction();
            return res.json201(proyect);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllProyects = async (req, res) => {
        try {
            const proyects = await this.pService.readAll();
            if (!proyects || proyects.length === 0) throw new Error("Error: Proyects not found!");
            return res.json200(proyects);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPoryectsPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchByName, searchByCompany, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFilter, language);
            const pipeline = [...beforeLookup, lookup("skills", "responsibilities", "categories"), ...afterLookup];
            const proyects = await this.pService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if (!proyects || proyects.docs.length === 0) throw new Error("Error: Proyects not found!");
            return res.json200(proyects);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProyectsByFilter = async (req, res) => {
        try {
            let filter = req.query || {};
            filter = Object.assign({}, filter);
            if (Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to get the proyect/s!");
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (!isNaN(filter[key]) && filter[key] !== '') {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const proyects = await this.pService.readByFilter(filter);
            if (!proyects || proyects.length === 0) throw new Error("Error: Proyects not found!");
            return res.json200(proyects);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllProyectsPopulate = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if (populateFields.length === 0) throw new Error("Error: Missing information to populate the proyects!");
            const proyects = await this.pService.readAllAndPopulate(populateFields);
            if (!proyects || proyects.length === 0) throw new Error("Error: Proyects not found!");
            return res.json200(proyects);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllProyectsPopulateFilter = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if (populateFields.length === 0) throw new Error("Error: Missing information to populate the proyects!");
            const {category } = req.query;
            if(category && !isValidObjectId(category)) throw new Error("Error: Invalid Category Id to filter the list of Proyects!");
            const filter = {};
            if(category) filter.categories = category;
            const proyects = await this.pService.readAllAndPopulateFilters(populateFields, filter);
            if (!proyects || proyects.length === 0) throw new Error("Error: Proyects not found!");
            return res.json200(proyects);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProyectById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the proyect!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the proyect!");
            const proyect = await this.pService.readById(id);
            if (!proyect) throw new Error("Error: Proyect not found!");
            return res.json200(proyect);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProyectByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.key(filter).length === 0) throw new Error("Error: Missing the filter/s to get the Proyect!");
            const proyect = await this.pService.readOneByFilter(filter);
            if (!proyect) throw new Error("Error: Proyect not found!");
            return res.json200(proyect);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProyectByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the proyect!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the proyect!");
            let populateFields = [];
            if (req.query.populate) { populateFields = Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]; };
            if (populateFields.length === 0) throw new Error("Error: Missing the information to populate the proyect!");
            const proyect = await this.pService.readByIdAndPopulate(id, populateFields);
            if (!proyect) throw new Error("Error: Proyect not found!");
            return res.json200(proyect);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateProyectById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the proyect!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the proyect!");
            const data = req.body;
            if (!data || !data.name || !data.company || !data.description) throw new Error("Error: Missing information to update the proyect!");
            const files = req.files || [];
            if (data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            if (data.name) data.name = JSON.parse(data.name);
            if (data.company) data.company = JSON.parse(data.company);
            if (data.description) data.description = JSON.parse(data.description);
            if (data.dateEnd === "" || data.dateEnd === "null" || data.dateEnd === null) data.dateEnd = null;
            if (data.categories) data.categories = JSON.parse(data.categories);
            if (data.responsibilities) data.responsibilities = JSON.parse(data.responsibilities);
            if (data.skills) data.skills = JSON.parse(data.skills);
            const proyect = await this.pService.readById(id);
            if (!proyect) throw new Error("Error: Couldn't found the proyect!");
            const verify = await this.verifyNameProyect(data.name, id);
            if (verify === 1) throw new Error("Error: The name of the proyect alredy Exist!");
            const folder = `proyects/${id.toString()}`;
            //const updatedProyect = await this.pService.updateOneWithImages(proyect, data, files, folder, session);
            const updatedProyect = await this.pService.updateOneWithImages(proyect, data, files, folder);
            if (!updatedProyect) throw new Error("Error: Couldn't update the proyect!");
            //await session.commitTransaction();
            return res.json200(updatedProyect);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    updateProyectsOrder = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("Error: No ordered Proyects was provided!");
            const proyectsOrderUpdate = await this.pService.updateOrderDragDrop(data);
            if(!proyectsOrderUpdate) return res.json500("Error in updating the order of the proyects!");
            //await session.commitTransaction();
            return res.json200(proyectsOrderUpdate);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteProyectById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the proyect!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the proyect!");
            const proyect = await this.pService.readById(id);
            if (!proyect) throw new Error("Error: Proyect not found!");
            const folder = "proyects";
            const deleteFolder = await this.pService.destroyFolder(id, folder);
            const deletedProyect = await this.pService.destroyById(id);
            if (!deletedProyect) throw new Error("Error: Couldn't delete the proyect!");
            //await this.pService.reorderAfterDelete(session);
            await this.pService.reorderAfterDelete();
            //await session.commitTransaction();
            return res.json200(deletedProyect);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    verifyNameProyect = async (name, id = null) => {
        try {
            if (!name) return res.json400("Error: Missing the Name of the Proyect to verify!");
            const verifiy = await this.pService.readOneByFilter({ name });
            if (!verifiy) return 0;
            if (id && verifiy._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const proyectsController = new ProyectsController();

export default proyectsController;