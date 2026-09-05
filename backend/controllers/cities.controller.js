import mongoose, { isValidObjectId } from "mongoose";
import citiesService from "../services/cities.service.js";
import { parseBracketQuery } from "../helpers/query.helper.js";
import provincesService from "../services/provinces.service.js";
import peopleService from "../services/people.service.js";

class CitiesController {
    constructor() {
        this.ciService = citiesService;
        this.provService = provincesService;
        this.peoService = peopleService;
    };

    createCity = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if (!data || !data.name || !data.zipCode) throw new Error("Error: Missing information to create the City!");
            const cityData = { name: { es: data.name?.es || "", en: data.name?.en || "" }, zipCode: data.zipCode };
            const verify = await this.verifyZipCode(data.zipCode);
            if (verify === 1) throw new Error("Error: The Zip Code aldredy exist in an other City!");
            const city = await this.ciService.createOne(cityData, session);
            if (!city) throw new Error("Error: Couldn't create the City!");
            await session.commitTransaction();
            return res.json201(city);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllCities = async (req, res) => {
        try {
            const cities = await this.ciService.getAllCities();
            if (!cities || cities.length === 0) throw new Error("Error: Cities not found!");
            return res.json200(cities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCitiesPaginate = async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = {} } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 1;
            //Filter:
            const parsedFilter = parseBracketQuery(req.query, "filter", value => JSON.parse(value));
            //Sot:
            const parsedSort = parseBracketQuery(req.query, "sort", Number);
            const cities = await this.ciService.readPaginate({ page: verifyPage, limit: verifyLimit, filter: parsedFilter, sort: parsedSort });
            if (!cities || cities.docs.length === 0) return res.json404("Error: Cities paginate not found!");
            return res.json200(cities);
        } catch (error) {
            return res.json500();
        }
    };

    getCitiesByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Filter is needed to return the cities!");
            const cities = await this.ciService.readByFilter(filter);
            if (!cities || cities.length === 0) return res.json404("Error: No cities found!");
            return res.json200(cities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCityById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Id of the City is missing!");
            if (!isValidObjectId(id)) return res.json400("Error: Id of the City is missing!");
            const city = await this.ciService.readById(id);
            if (!city) return res.json404("Error: City not Found!");
            return res.json200(city);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCityByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Filter is needed to return the info of the City!");
            const city = await this.ciService.readOneByFilter(filter);
            if (!city) return res.json404("Error: City not Found!");
            return res.json200(city);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateCityById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Id of the City is missing!");
            if (!isValidObjectId(id)) throw new Error("Error: Id of the City is invalid!");
            const data = req.body;
            if (!data || !data.name) throw new Error("Error: Missing the information to update the City!");
            const city = await this.ciService.readById(id);
            if (!city) return res.json404("Error: City not Found!");
            if (data.zipCode) {
                const verifyZipCode = await this.verifyZipCode(data.zipCode, id);
                if (verifyZipCode === 1) throw new Error("Error: The Zip Code Alredy exist in an other City!");
            };
            const cityUpdated = await this.ciService.updateById(id, data, { session });
            await session.commitTransaction();
            if (!cityUpdated) throw new Error("Error: Couldn't Update the City!");
            return res.json200(cityUpdated);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteCityById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Id of the City is missing!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the City!");
            const city = await this.ciService.readById(id);
            if (!city) throw new Error("Error: City not Found!");
            const cityObjectId = new mongoose.Types.ObjectId(id);
            const province =  await this.provService.readOneByFilter({ cities: cityObjectId });
            if(province) {
                const cities = province.cities.filter(city => city._id.toString() !== id);
                province.cities = cities;
                await this.provService.updateById(province._id, province, { session });
            };
            const people = await this.peoService.readByFilter({ cities: cityObjectId });
            if(people && people.length > 0) {
                for(const person of people) {
                    person.cities = null;
                    await this.peoService.updateById(person._id, person, { session });
                };
            };
            const cityDeleted = await this.ciService.destroyById(id, { session });
            if (!cityDeleted) throw new Error("Error: Coulnd't Delete the City!"); 
            await session.commitTransaction();
            return res.json200(cityDeleted);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllCitiesUnassigned = async (req, res) => {
        try {
            const provinces = await this.provService.readAll();
            if (!provinces || provinces.length === 0) return res.json404("Error: No Provinces Found!");
            const cities = await this.ciService.readAll();
            if (!cities || cities.length === 0) return res.json404("Error: No Cities Found!");
            const assignedCitiesIds = new Set();
            provinces.forEach(province => { province.cities.forEach(city => { assignedCitiesIds.add(city.toString()); }); });
            const availablesCities = cities.filter(city => !assignedCitiesIds.has(city._id.toString()));
            return res.json200(availablesCities);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    verifyZipCode = async (zipCode, cid = null) => {
        try {
            if (!zipCode) throw new Error("Missing the Zip Code of the City to verify if aldredy Exist!");
            const verify = await this.ciService.readOneByFilter({ zipCode });
            if (!verify) return 0;
            if (cid && verify._id.toString() === cid.toString()) { return 0; }
            else { return 1; }
        } catch (error) {
            throw error;
        }
    };

    permissionsUser = async (id, permission) => {
        try {
            if (!id) throw new Error("Error: Missing User Id to verify permissions!");
            if (!permission) throw new Error("Error: Missing the permission to verify!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the User to verify permissions!");
            const populateFields = ["roles", "roles.permissions", "extraPermission"];
            const user = await this.uService.readByIdAndPopulate(id, populateFields);
            if (!user) throw new Error("Error: User not found!");
            const rolesPermissions = user.roles?.flatMap(role => role.permissions) || [];
            const extraPermissions = user.extraPermission || [];
            const allPermissions = [...rolesPermissions, ...extraPermissions];
            const permissionsSet = new Set(allPermissions.map(per => per.key));
            return permissionsSet.has(permission);
        } catch (error) { throw error; }
    };
};

const citiesController = new CitiesController();

export default citiesController;