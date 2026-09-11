import mongoose, { isValidObjectId } from "mongoose";
import habilitiesService from "../services/habilities.service.js";
import educationsService from "../services/educations.service.js";
import { parseBracketQuery } from "../helpers/query.helper.js";

class HabilitiesController {
    constructor () {
        this.hService = habilitiesService;
        this.eService = educationsService;
    };

    createHability = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!data || !data.name) throw new Error("Error: Missing information to create the hability!");
            const habilityData = { name: { es: data.name?.es || "" , en: data.name?.en || "" } };
            const verify = await this.verifyName(data.name);
            if(verify === 1) throw new Error("Error: The name of the hability alredy exist!");
            const hability = await this.hService.createOne(data);
            if(!hability) throw new Error("Error: Couldn't create the hability!");
            await session.commitTransaction();
            return res.json201(hability);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllHabilities = async (req, res) => {
        try {
            const habilities = await this.hService.readAll();
            if(!habilities || habilities.length === 0) throw new Error("Error: Habilites not found!");
            return res.json200(habilities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getHabilitesPaginate = async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = {} } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter", value => JSON.parse(value));
            const parsedSort = parseBracketQuery(req.query, "sort", Number);
            const habilities = await this.hService.readPaginate({ page: verifyPage, limit: verifyLimit, filter: parsedFilter, sort: parsedSort });
            if(!habilities || habilities.docs.length === 0) throw new Error("Error: Habilities paginate not found!");
            return res.json200(habilities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getHabilitiesByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Filter/s is missing!");
            const habilites = await this.hService.readByFilter(filter);
            if(!habilites || habilites.length === 0) throw new Error("Error: Habilities not found!");
            return res.json200(habilites);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getHabilityById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the haiblity!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the hability!");
            const hability = await this.hService.readById(id);
            if(!hability) throw new Error("Error: Hability not found!");
            return res.json200(hability);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getHabilityByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Filter/s is missing!");
            const hability = await this.hService.readOneByFilter(filter);
            if(!hability) throw new Error("Error: Hability not found!");
            return res.json200(hability);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateHabilityById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the hability!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the hability!");
            const data = req.body;
            if(!data || !data.name) throw new Error("Error: Missing the information to update the hability!");
            const hability = await this.hService.readById(id);
            if(!hability) throw new Error("Error: Hability not found!");
            const verify = await this.verifyName(data.name, id);
            if(verify === 1) throw new Error("Error: The name of the hability alredy exist!");
            const updatedHability = await this.hService.updateById(id, data, { session });
            if(!updatedHability) throw new Error("Error: Couldn't update the hability!");
            await session.commitTransaction();
            return res.json200(updatedHability);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteHabilityById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the hability!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the hability!");
            const hability = await this.hService.readById(id);
            if(!hability) throw new Error("Error: Couldn't find the hability!");
            const habilityObjectId = new mongoose.Types.ObjectId(id);
            const educations = await this.eService.readByFilter({ habilities: habilityObjectId });
            if(educations && educations.length > 0) {
                for(const education of educations) {
                    const habilities = education.habilities.filter(hability => hability._id.toString() !== id);
                    educations.habilites = habilities;
                    await this.eService.updateById(education._id, education, { session });
                };
            };
            const deletedHability = await this.hService.destroyById(id, { session });
            if(!deletedHability) throw new Error("Error: Couldn't delete the hability!");
            await session.commitTransaction();
            return res.json200(deletedHability);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyName = async (name, id = null )=> {
        const query =  {
            "name.en": name?.en || name,
        };
        const verify = await this.hService.readOneByFilter(query);
        if(!verify) return 0;
        if(id && verify._id.toString() === id.toString()) return 0;
        return 1;
    };
};

const habilitiesController = new HabilitiesController();

export default habilitiesController;