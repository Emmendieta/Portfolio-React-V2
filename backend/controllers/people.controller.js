import mongoose, { isValidObjectId } from "mongoose";
import peopleService from "../services/people.service.js";
import usersService from "../services/users.service.js";
import { buildMatchStages, buildMatchStagesGeneric, parseBracketQuery, parsePopulateQuery } from "../helpers/query.helper.js";
import { lookup } from "../helpers/lookup.helper.js";

class PeopleController {
    constructor() {
        this.pService = peopleService;
        this.uService = usersService;
    };

    createPersonWithImages = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = { ...req.body };
            const files = req.files || [];
            const peoplePath = "people";
            if (data.jobTitle) data.jobTitle = JSON.parse(data.jobTitle);
            if (data.address) data.address = JSON.parse(data.address);
            if (data.legalAddress) data.legalAddress = JSON.parse(data.legalAddress);
            if (data.aboutMe) data.aboutMe = JSON.parse(data.aboutMe);
            data.dni = Number(data.dni);
            data.cuil = Number(data.cuil);
            data.phone = Number(data.phone);
            if (data.address?.number) data.address.number = Number(data.address.number);
            if (data.address?.floor) data.address.floor = Number(data.address.floor);
            if(data.legalAddress?.number) data.legalAddress.number = Number(data.legalAddress.number);
            if(data.legalAddress?.floor) data.legalAddress.floor = Number(data.legalAddress.floor);
            if (!data || !data.firstName || !data.lastName || !data.dni || !data.cuil || !data.birthday) throw new Error("Error: Missing infomation to create the person!");
            if (Number.isNaN(data.dni)) throw new Error("Error: Invalid DNI!");
            const verify = await this.verifyDNI(data.dni);
            if (verify === 1) throw new Error("Error: The DNI alredy exist in an other person!");
            const person = await this.pService.createOneWithImages(data, files, peoplePath, session);
            if (!person) throw new Error("Error: Couldn't create the person!");
            await session.commitTransaction();
            return res.json201(person);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getPeople = async (req, res) => {
        try {
            const people = await this.pService.readAll();
            if (!people || people.length === 0) throw new Error("Error: Couldn't found people!");
            return res.json200(people);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPeoplePaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, language = "es", searchPerson, searchDNI, searchContinent, searchCountry, searchProvince, searchCity } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const pipeline = [];
            //Full name:
            if (searchPerson) {
                pipeline.push({ $addFields: { fullName: { $concat: [{ $toLower: "$lastName" }, " ", { $toLower: "$firstName" }] }}},
                    { $match: { fullName: { $regex: searchPerson.toLowerCase(), $options: "i" } } }
                );
            };
            //DNI:
            if (searchDNI) {
                pipeline.push({ $addFields: { dniStr: { $toString: "$dni" } } }, {
                    $match: { dniStr: { $regex: String(searchDNI) } }
                })
            };
            //Lookup:
            pipeline.push(
                lookup("continents", "continents"),
                lookup("countries", "countries"),
                lookup("provinces", "provinces"),
                lookup("cities", "cities")
            );
            //After Looukup:
            const { afterLookup } = buildMatchStages({ "continents.name": searchContinent, "countries.name": searchCountry, "provinces.name": searchProvince, "cities.name": searchCity }, language);
            pipeline.push(...afterLookup);
            const people = await this.pService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline, sort: { lastName: 1, firstName: 1 } });
            if (!people || people.docs.length === 0) throw new Error("Error: People not found!");
            return res.json200(people);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    //USAR ESTE PARA LOS POPUALTE:
    getPeoplePopulate = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if(populateFields.length === 0) throw new Error("Error: Missing information to populate people!");
            const people = await this.pService.readAllAndPopulate(populateFields);
            if(!people || people.length === 0) throw new Error("Error: People not found!");
            return res.json200(people);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPeopleByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Filter/s is missing!");
            const people = await this.pService.readByFilter(filter);
            if(!people || people.length === 0) throw new Error("Error: People not found!");
            return res.json200(people);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOnePersonById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the person!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the person!");
            const person = await this.pService.readById(id);
            if (!person) throw new Error("Error: Person not found!");
            return res.json200(person);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPersonByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s!");
            const person = await this.pService.readOneByFilter(filter);
            if(!person) throw new Error("Error: Person not found!");
            return res.json200(person);
        } catch (error) {
            return res.json200(error.message);
        }
    };

    getPersonByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the person!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the person!");
            let populateFields = [];
            if(req.query.populate) { populateFields = Array.isArray(req.query.populate) ? req.query.populate: [req.query.populate]; };
            if(populateFields.length === 0) throw new Error("Error: Missing information to populate the person!");
            const person = await this.pService.readByIdAndPopulate(id, populateFields);
            if(!person) throw new Error("Error: Person populate not found!");
            return res.json200(person);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updatePersonById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing Id the person!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the person!");
            const data = req.body;
            const files = req.files || [];
            if(data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            if(data.jobTitle) data.jobTitle = JSON.parse(data.jobTitle);
            if(data.address) data.address = JSON.parse(data.address);
            if(data.legalAddress) data.legalAddress = JSON.parse(data.legalAddress);
            if(data.aboutMe) data.aboutMe = JSON.parse(data.aboutMe);
            data.dni = Number(data.dni);
            data.cuil = Number(data.cuil);
            data.phone = Number(data.phone);
            if(data.address?.number) data.address.number = Number(data.address.number);
            if(data.address?.floor) data.address.floor = Number(data.address.floor);
            if(data.legalAddress?.number) data.legalAddress.number = Number(data.legalAddress.number);
            if(data.legalAddress?.floor) data.legalAddress.floor = Number(data.legalAddress.floor);
            const person = await this.pService.readById(id);
            if(!person) throw new Error("Error: Person not found!");
            const verify = await this.verifyDNI(data.dni, id);
            if(verify === 1) throw new Error("Error: The DNI alredy exist in an other person!");
            const folder = `people/${id.toString()}`;
            const updatedPerson = await this.pService.updateOneWithImages(person, data, files, folder, session);
            if(!updatedPerson) throw new Error("Error: Couldn't update the person!");
            await session.commitTransaction();
            return res.json200(updatedPerson);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deletePersonById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the person!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the person!");
            const person = await this.pService.readById(id);
            if(!person) throw new Error("Error: Person not found!");
            const personObjectId = new mongoose.Types.ObjectId(id);
            const users = await this.uService.readByFilter({ people: personObjectId });
            if(users && users.length > 0) {
                for(const user of users) {
                    user.people = null;
                    await this.uService.updateById(user._id, user, { session });
                };
            };
            const folder = "people";
            const deleteFolder = await this.pService.destroyFolder(id, folder);
            if(!deleteFolder) throw new Error("Error: Couldn't delete the Folder from Cloudinary!");
            const deletedPerson = await this.pService.destroyById(id, { session });
            if(!deletedPerson) throw new Error("Error: Couldn't delete the person!");
            await session.commitTransaction();
            return res.json200(deletedPerson);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyDNI = async (dni, id = null) => {
        try {
            const verify = await this.pService.readOneByFilter({ dni });
            if (!verify) return 0;
            if (id && verify._id.toString() === id.toString()) return 0;
            else return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const peopleController = new PeopleController();

export default peopleController;