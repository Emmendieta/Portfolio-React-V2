import mongoose, { isValidObjectId } from "mongoose";
import provincesService from "../services/provinces.service.js";
import countriesService from "../services/countries.service.js";
import { lookup } from "../helpers/lookup.helper.js";
import peopleService from "../services/people.service.js";
import { buildMatchStages, parseBracketQuery } from "../helpers/query.helper.js";

class ProvincesController {
    constructor() {
        this.proService = provincesService;
        this.counService = countriesService;
        this.peoService = peopleService;
    };

    createProvince = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if (!data || !data.name) throw new Error("Error: Missing information to create the Province!");
            const verify = await this.verifyNameProvince(data.name);
            if (verify === 1) throw new Error("Error: The Name of the Province alredy Exist!");
            //const province = await this.proService.createOne(data, { session });
            const province = await this.proService.createOne(data);
            if (!province) throw new Error("Error: Couldn't create the Province!");
            //await session.commitTransaction();
            return res.json201(province);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllProvinces = async (req, res) => {
        try {
            const provinces = await this.proService.readAll();
            if (!provinces || provinces.length === 0) return res.json404("Error: Provinces not Found!");
            return res.json200(provinces);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProvincesPaginatePopulte = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchProvince, searchCity, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFilter, language);
            const pipeline = [...beforeLookup, lookup("cities", "cities", "_id", "cities"), ...afterLookup];
            const provinces = await this.proService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if (!provinces || provinces.docs.length === 0) return res.json404("Error: Province not found!");
            return res.json200(provinces);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getProvincesByFilter = async (req, res) => {
        try {

            let filter = req.query || {};
            filter = Object.assign({}, filter);
            if (Object.keys(filter).length === 0) return req.json400("Error: Missing Filter/s to get the data of the Provinces!");
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (!isNaN(filter[key]) && filter[key] !== '') {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const provinces = await this.proService.readByFilter(filter);
            if (!provinces || provinces.length === 0) return res.json404("Error: Provinces not Found!");
            return res.json200(provinces);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllProvincesPopulate = async (req, res) => {
        try {
            let { populate } = req.query;
            let populateFields = [];
            if (Array.isArray(populate)) {
                populateFields = populate;
            } else if (typeof populate === "string" && populate.trim() !== "") {
                populateFields = populate.split("&");
            };
            if (populateFields.length === 0) {
                return res.json400("Error: Missing information to populate Province!");
            };
            const provinces = await this.proService.readAllAndPopulate(populateFields);
            if (!provinces || provinces.length === 0) return res.json404("Error: Provinces not Found!");
            return res.json200(provinces);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneProvinceById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) return res.json400("Error: Missing Id of the Province!");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Province!");
            const province = await this.proService.readById(id);
            if (!province) return res.json404("Error: Province not Found!");
            return res.json200(province);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneProvinceByFilter = async (req, res) => {
        try {
            let filter = req.query || {};

            filter = Object.assign({}, filter);
            if (Object.keys(filter).length === 0) return res.json400("Error: Missing Filter/s to get the data of the Province!");
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (!isNaN(filter[key]) && filter[key] !== '') {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const province = await this.proService.readOneByFilter(filter);
            if (!province) return res.json404("Error: Province not Found!");
            return res.json200(province);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneProvinceByIdAndPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Missing Id of the Province!");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Province!");
            const { populate } = req.query;
            const populateFields = populate ? populate.split("&") : [];
            if (!populateFields || populateFields.length === 0) return res.json400("Error: Missing Filter/s to get the data populate of the Province!");
            const province = await this.proService.readByIdAndPopulate(id, populateFields);
            if (!province) return res.json400("Error: Province not Found!");
            return res.json200(province);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateProvinceById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing Id of the Province!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Province!");
            const data = req.body;
            if (!data || !data.name) throw new Error("Error: Missing informtation to update the data of the Province!");
            const verify = await this.verifyNameProvince(data.name, id);
            if (verify === 1) return res.json400("Error: The Name of the Province alredy Exist!");
            const province = await this.proService.readById(id);
            if (!province) throw new Error("Error: Province not Found!");
            //const provinceUpdated = await this.proService.updateById(id, data, { session });
            const provinceUpdated = await this.proService.updateById(id, data);
            if (!provinceUpdated) throw new Error("Error: Coudn't update the Province!");
            //await session.commitTransaction();
            return res.json200(provinceUpdated);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteProvinceById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing Id of the Province!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Province!");
            const province = await this.proService.readById(id);
            if (!province) throw new Error("Error: Province not Found!");
            const provinceObjectId = new mongoose.Types.ObjectId(id);
            const country = await this.counService.readOneByFilter({ provinces: provinceObjectId });
            if(country) {
                const provinces = country.provinces.filter(province => province._id.toString() !== id);
                country.provinces = provinces;
                //await this.counService.updateById(country._id, country, { session });
                await this.counService.updateById(country._id, country);
            };
            const people = await this.peoService.readByFilter({ provinces: provinceObjectId });
            if(people && people.length > 0) {
                for(const person of people) {
                    person.provinces = null;
                    //await this.peoService.updateById(person._id, person, { session });
                    await this.peoService.updateById(person._id, person);
                };
            };
            //const provinceDeleted = await this.proService.destroyById(id, { session });
            const provinceDeleted = await this.proService.destroyById(id);
            if (!provinceDeleted) throw new Error("Error: Couldn't delete the Province!");
            //await session.commitTransaction();
            return res.json200(provinceDeleted);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    verifyNameProvince = async (name, id = null) => {
        try {
            if (!name) return res.json400("Error: Missing the Name of the Province to verify if alredy Exist!");
            const verify = await this.proService.readOneByFilter({ name });
            if (!verify) return 0;
            if (id && verify._id.toString() === id.toString()) { return 0; }
            else return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllProvincesUnassigned = async (req, res) => {
        try {
            const countries = await this.counService.readAll();
            if (!countries || countries.length === 0) return res.json404("Error: No countries found!");
            const provinces = await this.proService.readAll();
            if (!provinces || provinces.length === 0) return res.json404("Error: No provinces Found!");
            const assignedProvincesIds = new Set();
            countries.forEach(country => { country.provinces.forEach(province => { assignedProvincesIds.add(province.toString()); });; });
            const availablesProvinces = provinces.filter(province => !assignedProvincesIds.has(province._id.toString()));
            return res.json200(availablesProvinces);
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const provincesController = new ProvincesController();

export default provincesController;