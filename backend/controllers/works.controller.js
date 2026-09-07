import mongoose, { isValidObjectId } from "mongoose";
import worksService from "../services/works.service.js";
import { buildMatchStages, parseBracketQuery, parsePopulateQuery } from "../helpers/query.helper.js";
import { lookup } from "../helpers/lookup.helper.js";

class WorksController {
    constructor() {
        this.wService = worksService;
    };

    createWork = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!data || !data.jobTitle || !data.dateStart || !data.company || !data.description) throw new Error("Error: Missing information to create the Work!");
            const files = req.files || [];
            const worksPath = "works";
            if(data.jobTitle) data.jobTitle = JSON.parse(data.jobTitle);
            if(data.company) data.company = JSON.parse(data.company);
            if(data.description) data.description = JSON.parse(data.description);
            if(data.responsibilities) data.responsibilities = JSON.parse(data.responsibilities);
            const verify = await this.verifyJobTitleCompany(data.jobTitle, data.company);
            if(verify === 1) throw new Error("Error: The Job for the Company alredy exist!");
            const totalElements = await this.wService.totalElements();
            data.order = totalElements + 1;
            const work = await this.wService.createOneWithImages(data, files, worksPath, session);
            if(!work) throw new Error("Error: Couldn't create the work!");
            await session.commitTransaction();
            return res.json201(work);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllWorks = async (req, res) => {
        try {
            const works = await this.wService.readAll();
            if(!works || works.length === 0) throw new Error("Error: Works not found!");
            return res.json200(works);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getWorksPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchByJobTitle, searchByCompany, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFiler = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFiler, language);
            const pipeline = [...beforeLookup, lookup("responsibilities", "responsibilities", "_id", "responsibilities"), ...afterLookup];
            const works = await this.wService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if(!works || works.docs.length === 0) throw new Error("Error: Works not found!");
            return res.json200(works);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getWorksByFilter = async (req, res) => {
        try {
            let filter = req.query || {};
            filter = Object.assign({}, filter);
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to get the works!");
            for(const key in filter) {
                if(filter.hasOwnProperty(key)) {
                    if(!isNaN(filter[key]) && filter[key] !== "") {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const works = await this.wService.readByFilter(filter);
            if(!works || works.length === 0) throw new Error("Error: Works not found!");
            return res.json200(works);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllWorksPopulate = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if(populateFields.length === 0) throw new Error("Error: Missing the information to populate the works!");
            const works = await this.wService.readAllAndPopulate(populateFields);
            if(!works || works.length === 0) throw new Error("Error: Works not found!");
            return res.json200(works);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getWorkById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the work!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the work!");
            const work = await this.wService.readById(id);
            if(!work) throw new Error("Error: Work not found!");
            return res.json200(work);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getWorkByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.key(filter).length === 0) throw new Error("Error: Missing the filter/s to get the work!");
            const work = await this.wService.readOneByFilter(filter);
            if(!work) throw new Error("Error: Work not found!");
            return res.json200(work);
        } catch (error) {
            return res.json200(error.message);
        }
    };

    getWorkByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the work!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the work!");
            let populateFields = [];
            if(req.query.populate) { populateFields = Array.isArray(req.query.populate) ? req.query.populate: [req.query.populate]; };
            const work = await this.wService.readByIdAndPopulate(id, populateFields);
            if(!work) throw new Error("Error: Work not found!");
            return res.json200(work);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateWorkById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Work!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the work!");
            const data = req.body;
            if(!data || !data.JobTitle || !data.company || !data.description) throw new Error("Error: Missing information to update the Work!");
            data.JobTitle = JSON.parse(data.JobTitle);
            data.company = JSON.parse(data.company);
            data.description = JSON.parse(data.description);
            if(data.dateEnd === "null" || data.dateEnd === "") data.dateEnd = null;
            if(data.responsibilities) data.responsibilities
            if(data.finished === "true") data.finished = true;
            if(data.finished === "false") data.finished = false;
            if(typeof data.responsibilities === "string") data.responsibilities = JSON.parse(data.responsibilities);
            const files = req.files || [];
            if(data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            const work = await this.wService.readById(id);
            if(!work) throw new Error("Error: Work not found!");
            const verify = await this.verifyJobTitleCompany(data.JobTitle, data.company, id);
            if(verify === 1) throw new Error("Error: The Job for the Company alredy Exist!");
            const worksPath = `works/${id.toString()}`;
            const updatedWork = await this.wService.updateOneWithImages(work, data, files, worksPath, session);
            if(!updatedWork) throw new Error("Error: Couldn't update the Work!");
            await session.commitTransaction();
            return res.json200(work);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally { 
            await session.endSession();
        }
    };

    updateWorksOrder = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("No otdered works was provided!");
            const worksOrderUpdate = await this.wService.updateOrderDragDrop(data);
            if(!worksOrderUpdate) return res.json500("Error in updting the order of the works!");
            await session.commitTransaction();
            return res.json200(worksOrderUpdate);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            session.endSession();
        }
    }

    deleteWorkById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Work!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the work!");
            const work = await this.wService.readById(id);
            if(!work) throw new Error("Error: Work not found!");
            const folder = "works";
            const deleteFolder = await this.wService.deleteFolder(id, folder);
            if(!deleteFolder) throw new Error("Error: Couldn't delete the folder from Cloudinary!");
            const deletedWork = await this.wService.destroyById(id);
            if(!deletedWork) throw new Error("Error: Couldn't delete the work!");
            await this.wService.reorderAfterDelete(session);
            await session.commitTransaction();
            return res.json200(deletedWork);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally { 
            await session.endSession();
        }
    };

    verifyJobTitleCompany = async (jobTitle, company, id = null) => {
        try {
            if(!jobTitle || !company) return res.json400("Error: Missing the job title or the company to verify!");
            const verify = await this.wService.readOneByFilter({ jobTitle, company });
            if(!verify) return 0;
            if(id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const worksController = new WorksController();

export default worksController;