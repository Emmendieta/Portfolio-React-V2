import mongoose, { isValidObjectId } from "mongoose";
import educationsService from "../services/educations.service.js";
import habilitiesService from "../services/habilities.service.js";
import { buildMatchStages, parseBracketQuery, parsePopulateQuery } from "../helpers/query.helper.js";
import { lookup } from "../helpers/lookup.helper.js";

class EducationsController {
    constructor() {
        this.edService = educationsService;
        this.habilities = habilitiesService;
    };

    createEducation = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            const files = req.files || [];
            const educationsPath = "educations";
            if(!data || !data.institutionName || !data.title || !data.dateStart || !data.description) throw new Error("Error: Missing the information to create the Education!");
            if(data.institutionName) data.institutionName = JSON.parse(data.institutionName);
            if(data.title) data.title = JSON.parse(data.title);
            if(data.description) data.description = JSON.parse(data.description);
            if(data.habilities) data.habilities = JSON.parse(data.habilities);
            const verify = await this.verifiyNameEducationAndTitle(data.institutionName, data.title);
            if(verify === 1) throw new Error("Error: The Title for the institution alredy exist!");
            const totalElements = await this.edService.totalElements();
            data.order = totalElements + 1;
            //const education = await this.edService.createOneWithImages(data, files, educationsPath, session);
            const education = await this.edService.createOneWithImages(data, files, educationsPath);
            if(!education) throw new Error("Error: Couldn't create the Education!");
            //await session.commitTransaction();
            return res.json201(education);            
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllEducations = async (req, res) => {
        try {
            const educations = await this.edService.readAll();
            if(!educations || educations.length === 0) throw new Error("Error: Educations not found!");
            return res.json200(educations);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getEducationsPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, /* FALTAN FILTROS */ language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFiler = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFiler, language);
            const pipeline = [...beforeLookup, lookup("habilities"), ...afterLookup];
            const educations = await this.edService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if(!educations || educations.docs.length === 0) throw new Error("Error: Educations not found!");
            return res.json200(educations);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getEducaciontsByFilter = async (req, res) => {
        try {
            let filter = req.filter || {};
            filer = Object.assign({}, filter);
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to get the educations!");
            for (const key in filter) {
                if(filter.hasOwnProperty(key)) {
                    if(!isNaN(filter[key]) && filter[key] !== '') {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const educations = await this.edService.readByFilter(filter);
            if(!educations || educations.length === 0) throw new Error("Error: Educations not found!");
            return res.json200(educations);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllEducationsPopulate = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if(populateFields.length === 0) throw new Error("Error: Missing information to populate the educations!");
            const educations = await this.edService.readAllAndPopulate(populateFields);
            if(!educations || educations.length === 0) throw new Error("Error: Educations not found!");
            return res.json200(educations);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getEducationById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the education");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the education!");
            const eddcation = await this.edService.readById(id);
            if(!eddcation) throw new Error("Error: Education not found!");
            return res.json200(eddcation);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getEducationByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.key(filter).length === 0) throw new Error("Error: Missing filter/s to get the education!");
            const education = await this.edService.readOneByFilter(filter);
            if(!education) throw new Error("Error: Education not found!");
            return res.json200(education);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getEducationByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the education!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the education!");
            let populateFields = [];
            if(req.query.populate) { populateFields = Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]; };
            if(populateFields.length === 0) throw new Error("Error: Missing the information to populate the education!");
            const education = await this.edService.readByIdAndPopulate(id, populateFields);
            if(!education) throw new Error("Error: Education not found!");
            return res.json200(education);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateEducationById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the education!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Education!");
            const data = req.body;
            const files = req.files || [];
            if(data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            if(data.institutionName) data.institutionName = JSON.parse(data.institutionName);
            if(data.title) data.title = JSON.parse(data.title);
            if(data.description) data.description = JSON.parse(data.description);
            if(data.habilities) data.habilities = JSON.parse(data.habilities);
            const education = await this.edService.readById(id);
            if(!education) throw new Error("Error: Education not found!");
            const verifiy = await this.verifiyNameEducationAndTitle(data.institutionName, data.title, id);
            if(verifiy === 1) throw new Error("Error: The Title for the Education alredy exist!");
            const folder = `educations/${id.toString()}`;
            //const updatedEducation = await this.edService.updateOneWithImages(education, data, files, folder, session);
            const updatedEducation = await this.edService.updateOneWithImages(education, data, files, folder);
            if(!updatedEducation) throw new Error("Error: Couldn't update the Education!");
            //await session.commitTransaction();
            return res.json200(updatedEducation);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    updateEducationsOrder = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("Error: No ordered educations was provided!");
            const educationsOrderUpdate = await this.edService.updateOrderDragDrop(data);
            if(!educationsOrderUpdate) return res.json500("Error in updating the order of the Educations!");
            //await session.commitTransaction();
            return res.json200(educationsOrderUpdate);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteEducationById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Education!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the education!");
            const education = await this.edService.readById(id);
            if(!education) throw new Error("Error: Education not found!");
            const folder = "educations";
            const deleteFolder = await this.edService.destroyFolder(id, folder);
            if(!deleteFolder) throw new Error("Error: Couldn't delete the folder from Cloudinary!");
            const deletedEducation = await this.edService.destroyById(id);
            if(!deletedEducation) throw new Error("Error: Couldn't delete the education!");
            //await this.edService.reorderAfterDelete(session);
            await this.edService.reorderAfterDelete();
            //await session.commitTransaction();
            return res.json200(education);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally { 
            //await session.endSession();
        }
    };

    verifiyNameEducationAndTitle = async (institutionName, title, id = null) => {
        try {
            if(!institutionName && !title) return res.json400("Error: Missing the name of the Institution and the title!");
            const verifiy = await this.edService.readOneByFilter({ institutionName, title });
            if(!verifiy) return 0;
            if(id && verifiy._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };    
};

const educationsController = new EducationsController();

export default educationsController;