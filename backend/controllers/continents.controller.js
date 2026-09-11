import mongoose, { isValidObjectId } from "mongoose";
import continentsService from "../services/continents.service.js";
import countriesService from "../services/countries.service.js";
import peopleService from "../services/people.service.js";
import { lookup } from "../helpers/lookup.helper.js";
import { buildMatchStages, buildMatchStagesGeneric, parseBracketQuery } from "../helpers/query.helper.js";

class ContinentsController {
    constructor() {
        this.conService = continentsService;
        this.counService = countriesService;
        this.peoService = peopleService;
    };

    createContinent = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if (!data || !data.name) throw new Error("Missing the information to create a Continent!");
            const verifyContinent = await this.verifyNameContient(data.name);
            if (verifyContinent === 1) throw new Error("Continent alredy Exist!");
            //const continent = await this.conService.createOne(data,{ session });
            const continent = await this.conService.createOne(data);
            if (!continent) throw new Error("Error: Couldn't create the Continent!");
            //await session.commitTransaction();
            return res.json201(continent);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllContinents = async (req, res) => {
        try {
            const continents = await this.conService.readAll();
            if (!continents || continents.length === 0) return res.json404("Continents not Found!");
            return res.json200(continents);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getContinentesPaginePopulate = async (req, res) => {
        try {
            //let { page = 1, limit = 10, searchContinent, searchCountry, language = "es" } = req.query;
            const { page = 1, limit = 10, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter");
            //const { beforeLookup, afterLookup } = buildMatchStages(parsedFilter, language);
            //const pipeline = [...beforeLookup, lookup("countries", "countries", "_id", "countries"), ...afterLookup];
            const pipeline = [...buildMatchStagesGeneric(
                parsedFilter, { language, translatedFields:["name"]}),
                lookup("countries", "countries")
            ];
            const continents = await this.conService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if(!continents || continents.docs.length === 0) return res.json400("Error: Continent not found!");
            return res.json200(continents);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllContinentsPopulate = async (req, res) => {
        try {
            let { populate } = req.query;
            let populateFields = [];
            if (Array.isArray(populate)) {
                populateFields = populate;
            } else if (typeof populate === "string" && populate.trim() !== "") {
                populateFields = populate.split("&");
            };
            if (populateFields.length === 0) {
                return res.json400("Error: Missing information to populate Continents!");
            };
            const continents = await this.conService.readAllAndPopulate(populateFields);
            if (!continents || continents.length === 0) return res.json404("Error: Continents not Found!");
            return res.json200(continents);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getContinentsByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Filter is missing!");
            const continents = await this.conService.readByFilter(filter);
            if (!continents || continents.length === 0) return res.json404("Error: Continents not Found!");
            return res.json200(continents);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getContinentById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Missing the Id of the Continent!");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Continent!");
            const continent = await this.conService.readById(id);
            if (!continent) return res.json404("Error: Continent not Found!");
            return res.json200(continent);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneContinentByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) return res.json400("Error: Filter is missing!");
            const continent = await this.conService.readOneByFilter(filter);
            if (!continent) return res.json404("Error: Continent not Found!");
            return res.json200(continent);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneContinentByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.json400("Error: Missing Id of the Continent!");
            if (!isValidObjectId(id)) return res.json400("Error: Invalid Id of the Continent!");
            let { populate } = req.query;
            let populateFields = [];
            if (Array.isArray(populate)) {
                populateFields = populate;
            } else if (typeof populate === "string" && populate.trim() !== "") { populateFields = populate.split("&"); };
            if (populateFields.length === 0) return res.json400("Error: Missing information to populate the Continent by Id!");
            const continent = await this.conService.readByIdAndPopulate(id, populateFields);
            if (!continent) return res.json404("Error: Continent not Found!");
            return res.json200(continent);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateContinentById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Id of the Continent is missing!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Continent!");
            const data = req.body;
            if (!data) throw new Error("Error: Missing the information tu update the Contient!");
            if (data.name) {
                const verifyContinent = await this.verifyNameContient(data.name, id);
                if (verifyContinent === 1) throw new Error("Error: The name of the Continent alredy Exist!");
            };
            //const continent = await this.conService.updateById(id, data, { session });
            const continent = await this.conService.updateById(id, data);
            if (!continent) throw new Error("Error: Continent not Found!");
            //await session.commitTransaction();
            return res.json200(continent);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteContinentById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Id of the Contient is missing!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Continent!");
            const continent = await this.conService.readById(id);
            if (!continent) throw new Error("Error: Contient not Found!");
            const continentObjectId = new mongoose.Types.ObjectId(id);
            const people = await this.peoService.readByFilter({ continents: continentObjectId });
            if(people && people.length > 0) {
                for(const person of people) {
                    person.continents = null;
                    //await this.peoService.updateById(person._id, person, { session });
                    await this.peoService.updateById(person._id, person);
                };
            };
            //const continentDelted = await this.conService.destroyById(id,{ session });
            const continentDelted = await this.conService.destroyById(id);
            if (!continentDelted) throw new Error("Error: Couldn't delete the Continent!");
            //await session.commitTransaction();
            return res.json200(continentDelted);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    verifyNameContient = async (name, id = null) => {
        try {
            if (!name) throw new Error("Missing the name of the Continent to verify if alredy Exist!");
            for (const lang in name) {
                if (name.hasOwnProperty(lang)) {
                    const verify = await this.conService.readByFilter({ [`name.${lang}`]: name[lang] });
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
};

const continentController = new ContinentsController();

export default continentController;