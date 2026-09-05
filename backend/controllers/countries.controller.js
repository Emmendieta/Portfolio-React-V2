import mongoose, { isValidObjectId } from "mongoose";
import countriesService from "../services/countries.service.js";
import continentsService from "../services/continents.service.js";
import peopleService from "../services/people.service.js";
import { lookup } from "../helpers/lookup.helper.js";
import { buildMatchStages, parseBracketQuery } from "../helpers/query.helper.js";

class CountriesController {
    constructor() {
        this.counService = countriesService;
        this.contService = continentsService;
        this.peoService = peopleService;
    };

    createCountry = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if (!data || !data.name || !data.provinces || !data.provinces.length === 0) throw new Error("Error: Missing infomation to create the Country!");
            const verify = await this.verifyNameCountry(data.name);
            if (verify === 1) throw new Error("Error: The Name of the Country alredy Exist!");
            const country = await this.counService.createOne(data, { session });
            if (!country) throw new Error("Error: Couldn't create the Country!");
            await session.commitTransaction();
            return res.json201(country);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllCountries = async (req, res) => {
        try {
            const countries = await this.counService.readAll();
            if (!countries || countries.length === 0) return res.json404("Error: Countries not Found!");
            return res.json200(countries);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllCountriesPopulate = async (req, res) => {
        try {
            let { populate } = req.query;
            let populateFields = [];
            if (Array.isArray(populate)) {
                populateFields = populate;
            } else if (typeof populate === "string" && populate.trim() !== "") {
                populateFields = populate.split("&");
            };
            if (populateFields.length === 0) {
                return res.json400("Error: Missing information to populate Countries!");
            };
            const countries = await this.counService.readAllAndPopulate(populateFields);
            if (!countries || countries.length === 0) return res.json404("Error: Countries populated not Found!");
            return res.json200(countries);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllCountriesPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchCountry, searchProvince, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFilter, language);
            const pipeline = [...beforeLookup, lookup("provinces", "provinces", "_id", "provinces"), ...afterLookup];
            const countries = await this.counService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if(!countries || countries.docs.length === 0) return res.json404("Error: Country not found!");
            return res.json200(countries);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCountriesByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Missing Filter/s to get the data of the Countries");
            const countries = await this.counService.readByFilter(filter);
            if (!countries || countries.length === 0) return res.json404("Error: Countries Not Found!");
            return res.json200(countries);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneCountryById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Missing Id of the Country!");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Country!");
            const country = await this.counService.readById(id);
            if (!country) return res.json404("Error: Country not Found!");
            return res.json200(country);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneCountryByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Missing filter/s to get the information of the Country!");
            const country = await this.counService.readOneByFilter(filter);
            if (!country) return res.json404("Error: Country not Found!");
            return res.json200(country);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneCountryPopulateById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Missing Id of the Country");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Country!");
            const { populate } = req.query;
            let populateFields = [];
            if(Array.isArray(populate)) { populateFields = populate }
            else if(typeof populate === "string") { populateFields = populate.split("&"); };
            if (!populateFields || populateFields.length === 0) return res.json400("Error: Missing information to get all the data of the Country!");
            const country = await this.counService.readByIdAndPopulate(id, populateFields);
            if (!country) return res.json404("Error: Country not Found!");
            return res.json200(country);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateCountryById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing Id of the Country!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Country!");
            const data = req.body;
            if (!data) throw new Error("Error: Missing information to update the data of The Country!");
            if(data.name) {
                const verify = await this.verifyNameCountry(data.name, data._id);
                if (verify === 1) throw new Error("Error: The Name of the Country alredy Exist!");
            };
            const countryUpdated = await this.counService.updateById(id, data, { session });
            if(!countryUpdated) throw new Error("Error: Couldn't update de Country!");
            await session.commitTransaction();
            return res.json200(countryUpdated);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteCountryById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing Id of the Country!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Country!");
            const country = await this.counService.readById(id);
            if (!country) throw new Error("Error: Country not Found!");
            const countryObjectId = new mongoose.Types.ObjectId(id);
            const continent = await this.contService.readOneByFilter({ countries: countryObjectId });
            if(continent) {
                const countries = continent.countries.filter(country => country._id.toString() !== id);
                continent.countries = countries;
                await this.contService.updateById(continent._id, continent, { session });
            };
            const people = await this.peoService.readByFilter({ countries: countryObjectId });
            if(people && people.length > 0) {
                for(const person of people) {
                    person.countries = null;
                    await this.peoService.updateById(person._id, person, { session });
                };
            };
            const countryDeleted = await this.counService.destroyById(id, { session });
            if (!countryDeleted) throw new Error("Error: Couldn't delete the Country!");
            await session.commitTransaction();
            return res.json200(countryDeleted);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyNameCountry = async (name, id = null) => {
        try {
            if (!name) throw new Error("Missing the name of the Country!");
            for (const lang in name) {
                if (name.hasOwnProperty(lang)) {
                    const verify = await this.counService.readByFilter({ [`name.${lang}`]: name[lang] });
                    if (verify && verify.length > 0) {
                        if (id && verify[0]._id.toString() === id.toString()) { return 0; };
                        return 1;
                    };
                };
            };
            return 0;
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllCountriesUnassinged = async (req, res) => {
        try {
            const continents = await this.contService.readAll();
            if(!continents || continents.length === 0) return res.json404("Error: No contients found!");
            const countries = await this.counService.readAll();
            if(!countries || countries.length === 0) return res.json404("Error: No Countries Found!");
            const assignedCountriesIds = new Set();
            continents.forEach(continent => { continent.countries.forEach(country => { assignedCountriesIds.add(country.toString()); }); });
            const availableCountries = countries.filter(country => !assignedCountriesIds.has(country._id.toString()));
            return res.json200(availableCountries);
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const countriesController = new CountriesController();

export default countriesController;