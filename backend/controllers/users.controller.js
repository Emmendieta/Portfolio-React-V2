import usersService from "../services/users.service.js";
import peopleService from "../services/people.service.js";
import mongoose, { isValidObjectId } from "mongoose";
import { createHash } from "../helpers/hash.helper.js";
import { lookup } from "../helpers/lookup.helper.js";
import { buildMatchStages, buildMatchStagesGeneric, parsePopulateQuery } from "../helpers/query.helper.js";

class UsersController {
    constructor() {
        this.uService = usersService;
        this.pService = peopleService;
    };

    createUser = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const body = req.body;
            const files = req.files || [];
            const user = { user: body.user, email: body.email, password: body.password, active: body.active === "true", order: 0 };
            const person = {
                firstName: body.firstName, lastName: body.lastName, dni: body.dni, cuil: body.cuil, birthday: body.birthday, phone: body.phone,
                jobTitle: body.jobTitle ? JSON.parse(body.jobTitle) : undefined, address: body.address ? JSON.parse(body.address) : undefined,
                legalAddress: body.legalAddress ? JSON.parse(body.legalAddress) : undefined, aboutMe: body.aboutMe ? JSON.parse(body.aboutMe): undefined, 
                continents: body.continents, countries: body.countries, provinces: body.provinces, cities: body.cities
            };
            if (!user.user || !user.email || !user.password || !user.active === undefined) throw new Error("Error: Missing information of the User to create!");
            if (!person.dni || !person.cuil || !person.firstName || !person.lastName || !person.birthday || !person.address || !person.legalAddress) throw new Error("Error: Missing information of the person to create the user!");
            person.dni = Number(person.dni);
            person.cuil = Number(person.cuil);
            person.phone = Number(person.phone);
            if (person.address?.number) person.address.number = Number(person.address.number);
            if (person.address?.floor) person.address.floor = Number(person.address.floor);
            if (person.legalAddress?.number) person.legalAddress.number = Number(person.legalAddress.number);
            if (person.legalAddress?.floor) person.legalAddress.floor = Number(person.legalAddress.floor);
            let verify = await this.verifyEmail(user.email);
            if (verify === 1) throw new Error("Error: Email alredy exist!");
            verify = await this.verifyUserName(user.user);
            if (verify === 1) throw new Error("Error: User name alredy exist!");
            verify = await this.verifyPersonDNI(person.dni);
            if (verify === 1) throw new Error("Error: DNI alredy exist!");
            person.continents = person.continents;
            person.countries = person.countries;
            person.provinces = person.provinces;
            person.cities = person.cities;
            const passHass = createHash(user.password);
            user.password = passHass;
            user.order = 0;
            user.roles = body.roles ? JSON.parse(body.roles) : [];
            user.extraPermission = body.extraPermission ? JSON.parse(body.extraPermission) : [];
            const personFolder = "people";
            const createPerson = await this.pService.createOneWithImages(person, files, personFolder, session);
            if (!createPerson) throw new Error("Error: Couldn't create the person!");
            user.people = createPerson._id;
            const newUser = await this.uService.createOne(user, session);
            if (!newUser) throw new Error("Error: Couldn't create the user!");
            await session.commitTransaction();
            return res.json201(newUser)
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllUsers = async (req, res) => {
        try {
            const users = await this.uService.readAll();
            if (!users || users.length === 0) throw new Error("Error: Users not found!");
            return res.json200(users);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getAllUsersPopulate = async (req, res) => {
        try {
            const populateFields = parsePopulateQuery(req.query.populate);
            if (populateFields.length === 0) throw new Error("Error: Missing information to populate the users!");
            const users = await this.uService.readAllAndPopulate(populateFields);
            if (!users || users.length === 0) throw new Error("Error: Users popualte not found!");
            return res.json200(users);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getUsersPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchUser, searchEmail, searchDNI, searchPerson, searchRole, searchPermission, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const pipeline = [];
            pipeline.push(...buildMatchStagesGeneric({ user: searchUser, email: searchEmail }));
            //Person:
            pipeline.push(lookup("people", "people"), {
                $unwind: {
                    path: "$people",
                    preserveNullAndEmptyArrays: true
                }
            });
            //Full Name:
            if (searchPerson) {
                pipeline.push({ $addFields: { fullName: { $concat: [{ $toLower: "$people.lastName" }, " ", { $toLower: "$people.firstName" }] } } },
                    { $match: { fullName: { $regex: searchPerson.toLowerCase(), $options: "i" } } }
                );
            };
            //DNI:
            if (searchDNI) {
                pipeline.push({ $addFields: { dniStr: { $toString: "$people.dni" } } },
                    { $match: { dniStr: { $regex: String(searchDNI) } } }
                );
            };
            //Location populate:
            pipeline.push(
                lookup("continents", "people.continents"),
                lookup("countries", "people.countries"),
                lookup("provinces", "people.provinces"),
                lookup("cities", "people.cities")
            );
            //Roles:
            pipeline.push(lookup("roles", "roles"));
            const { afterLookup: roleFilters } = buildMatchStages({ "roles.role": searchRole }, language);
            pipeline.push(...roleFilters);
            //Permissions:
            pipeline.push(
                lookup("permissions", "roles.permissions"),
                lookup("permissions", "extraPermission")
            );
            if (searchPermission) {
                pipeline.push({
                    $match: {
                        $or: [
                            { [`roles.permissions.name.${language}`]: { $regex: searchPermission, $options: "i" } },
                            { [`extraPermission.name.${language}`]: { $regex: searchPermission, $options: "i" } }
                        ]
                    }
                });
            };
            const users = await this.uService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline, sort: { user: 1 } });
            if (!users || users.docs.length === 0) throw new Error("Error: Users not found!");
            return res.json200(users);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getUsersByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to find the user/s!");
            const users = await this.uService.readByFilter(filter);
            if (!users || users.length === 0) throw new Error("Error: User/s not found!");
            return res.json200(users);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the user!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the user!");
            const user = await this.uService.readById(id);
            if (!user) throw new Error("Error: User not found!");
            return res.json200(user);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneUserByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if (Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to find the user!");
            const user = await this.uService.readOneByFilter(filter);
            if (!user) throw new Error("Error: User not found!");
            return res.json200(user);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    //USAR ESTE:
    getOneUserByIdPopulate = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the User!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the user!");
            const populateFields = parsePopulateQuery(req.query.populate);
            if (populateFields.length == 0) throw new Error("ERror: Missing information to populate the User by Id!");
            const user = await this.uService.readByIdAndPopulate(id, populateFields);
            if (!user) throw new Error("Error: User not found!");
            return res.json200(user);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateUserById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the user!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the user!");
            const body = req.body;
            const files = req.files || [];
            const user = { user: body.user, email: body.email, active: body.active === "true", order: 0 };
            if (body.password && body.password.trim() !== "") user.password = createHash(body.password);
            const person = {
                _id: body.personId, firstName: body.firstName, lastName: body.lastName, dni: body.dni, cuil: body.cuil, birthday: body.birthday, phone: body.phone,
                jobTitle: body.jobTitle ? JSON.parse(body.jobTitle) : undefined, address: body.address ? JSON.parse(body.address) : undefined, legalAddress: body.legalAddress ? JSON.parse(body.legalAddress) : undefined,
                aboutMe: body.aboutMe ? JSON.parse(body.aboutMe): undefined, continents: body.continents, countries: body.countries, provinces: body.provinces, cities: body.cities
            };
            if (person.dni) person.dni = Number(person.dni);
            if (person.cuil) person.cuil = Number(person.cuil);
            if (person.address?.number) person.address.number = Number(person.address.number);
            if (person.address?.floor) person.address.floor = Number(person.address.floor);
            if (person.legalAddress?.number) person.legalAddress.number = Number(person.legalAddress.number);
            if (person.legalAddress?.floor) person.legalAddress.floor = Number(person.legalAddress.floor);
            const existingImages = body.existingImages ? JSON.parse(body.existingImages) : [];
            user.roles = body.roles ? JSON.parse(body.roles) : [];
            user.extraPermission = body.extraPermission ? JSON.parse(body.extraPermission) : [];
            const existingUser = await this.uService.readById(id);
            if (!existingUser) throw new Error("Error: User not found!");
            const existingPerson = await this.pService.readById(person._id);
            if (!existingPerson) throw new Error("Error: Person not found");
            let verify;
            verify = await this.verifyUserName(user.user, id);
            if (verify === 1) throw new Error("Error: The user name alredy exist!");
            verify = await this.verifyEmail(user.email, id);
            if (verify === 1) throw new Error("Error: The email alredy exist!");
            verify = await this.verifyPersonDNI(person.dni, person._id);
            if (verify === 1) throw new Error("Error: The DNI alredy exist!");
            const folder = `people/${id.toString()}`;
            const updatedPerson = await this.pService.updateOneWithImages(existingPerson, { ...person, existingImages }, files, folder, session);
            if (!updatedPerson) throw new Error("Error: Couldn't update the information of the Person!");
            const updatedUser = await this.uService.updateById(id, user, { session });
            if (!updatedUser) throw new Error("Error: Couldn't update the information of the user!");
            await session.commitTransaction();
            return res.json200(updatedUser);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteUserById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the user!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the user!");
            const user = await this.uService.readById(id);
            if (!user) throw new Error("Error: User not found!");
            if(user.people) {
                const personId = new mongoose.Types.ObjectId(user.people._id);
                const person = await this.pService.readById(personId);
                if (!person) throw new Error("Error: Person not found to delete the user!");
                const folder = `people`;
                const deleteFolder = await this.pService.destroyFolder(personId.toString(), folder);
                const deletedPerson = await this.pService.destroyById(personId, { session });
                if (!deletedPerson) throw new Error("Error: Couldn't delete the person!");
            };
            const deletedUser = await this.uService.destroyById(id, { session });
            if (!deletedUser) throw new Error("Error: Couldn't delete the user!");
            await session.commitTransaction();
            return res.json200(deletedUser);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyEmail = async (email, id = null) => {
        try {
            if (!email) throw new Error("Error: Missing Email to verify User!");
            const verify = await this.uService.readOneByFilter({ email });
            if (!verify) return 0;
            if (id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            throw error;
        }
    };

    verifyUserName = async (user, id = null) => {
        try {
            if (!user) throw new Error("Error: Missing the user name to verify!");
            const verify = await this.uService.readOneByFilter({ user });
            if (!verify) return 0;
            if (id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            throw error;
        }
    };

    verifyPersonDNI = async (dni, id = null) => {
        try {
            if (!dni) throw new Error("Error: Missing the DNI to verify!");
            const verify = await this.pService.readOneByFilter({ dni });
            if (!verify) return 0;
            if (id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            throw error;
        }
    };
};

const usersController = new UsersController();

export default usersController;