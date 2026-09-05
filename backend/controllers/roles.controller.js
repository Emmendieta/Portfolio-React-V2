import mongoose, { isValidObjectId } from "mongoose";
import rolesService from "../services/roles.service.js";
import usersService from "../services/users.service.js";
import { buildMatchStages, parseBracketQuery } from "../helpers/query.helper.js";
import { lookup } from "../helpers/lookup.helper.js";

class RolesController {
    constructor() {
        this.rService = rolesService;
        this.uService = usersService;
    };

    createRole = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!data || !data.role) throw new Error("Error: Missing information to create the role!");
            const verify = await this.verifyRole(data.role);
            if(verify === 1) throw new Error("Error: The role alredy exist!");
            const role = await this.rService.createOne(data);
            if(!role) throw new Error("Error: Coulnd't create the role!");
            await session.commitTransaction();
            return res.json201(role);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllRoles = async (req, res) => {
        try {
            const roles = await this.rService.readAll();
            if(!roles || roles.length === 0) throw new Error("Error: Roles not found!");
            return res.json200(roles);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getRolesPaginate = async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = {} } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter", value => JSON.parse(value));
            const parsedSort = parseBracketQuery(req.query, "sort", Number);
            const roles = await this.rService.readPaginate({ page: verifyPage, limit: verifyLimit, filter: parsedFilter, sort: parsedSort });
            if(!roles || roles.docs.length === 0) throw new Error("Error: Roles paginate not found!");
            return res.json200(roles);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getRolesAndPopulate = async (req, res) => {
        try {
            const { populate } = req.query;
            let populateFields = [];
            if(Array.isArray(populate)) { populateFields = populate; }
            else if (typeof populate === "string" && populate.trim() !== "") { populateFields = [populate] ;};
            if(populateFields.length === 0) throw new Error("Error: MIssing the information to populate the role!");
            const roles = await this.rService.readAllAndPopulate(populateFields);
            if(!roles || roles.length === 0) throw new Error("Error: Roles populate not found!");
            return res.json200(roles);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getRolesPaginatePopulate = async (req, res) => {
        try {
            let { page = 1, limit = 10, searchRole, searchPermission, language = "es" } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter");
            const { beforeLookup, afterLookup } = buildMatchStages(parsedFilter, language);
            const pipeline = [...beforeLookup, lookup("permissions", "permissions", "_id", "permissions"), ...afterLookup];
            const roles = await this.rService.readPaginateAggregate({ page: verifyPage, limit: verifyLimit, pipeline });
            if(!roles || roles.docs.length === 0) throw new Error("Error: Coulnd't found roles paginate and popualte!");
            return res.json200(roles);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getRolesByFilter = async (req, res) => {
        try {
            const filter = parseBracketQuery(req.query, "filter");
            if(Object.keys(filter).length === 0) throw new Error("Eror: Missing filter/s to find the role/s!");
            const roles = await this.rService.readByFilter(filter);
            if(!roles || roles.length === 0) throw new Error("Error:L Coulnd't find a role with the filter/s applied!");
            return res.json200(roles);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getRoleById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the role!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the role!");
            const role = await this.rService.readById(id);
            if(!role) throw new Error("Error: Coulnd't found the role!");
            return res.json200(role);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneRoleByFilter = async (req, res) => {
        try {
            const filter = parseBracketQuery(req.query, "filter");
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing the filter/s to find the role!");
            const role = await this.rService.readOneByFilter(filter);
            if(!role) throw new Error("Error: Coulnd't found the role!");
            return res.json200(role);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOneRoleByIdAndPopualte = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id ofg the role!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the role!");
            const { populate } = req.query;
            let populateFields = [];
            if(Array.isArray(populate)) { populateFields = populate; }
            else if (typeof populate === "string" && populate.trim() !== "") { populateFields = [populate]; };
            if(populateFields.length === 0) throw new Error("Error: Missing information to populate the Role!");
            const role = await this.rService.readByIdAndPopulate(id, populateFields);
            if(!role) throw new Error("Error: Couldn't found the role populate!");
            return res.json200(role);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateRoleById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the id of the role!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the role!");
            const data = req.body;
            if(!data || !data.role) throw new Error("Error: Missing information to update the role!");
            const role = await this.rService.readById(id);
            if(!role) throw new Error("Error: Coulnd't find the role!");
            const verify = await this.verifyRole(data.role, id);
            if(verify === 1) throw new Error("Error: The name of the role alredy exist in another!");
            const updatedRole = await this.rService.updateById(id, data);
            if(!updatedRole) throw new Error("Error: Couldn't update the role!");
            await session.commitTransaction();
            return res.json200(updatedRole);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deleteRoleById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the role!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the role!");
            const role = await this.rService.readById(id);
            if(!role) throw new Error("Error: Coulnd't found the role!");
            const roleObjectId = new mongoose.Types.ObjectId(id);
            const users = await this.uService.readByFilter({ roles: roleObjectId });
            if(users && users.length > 0) {
                for(const user of users) {
                    const roles = user.roles.filter(role => role._id.toString() !== id);
                    user.roles = roles;
                    await this.uService.updateById(user._id, user, { session });
                };
            };
            const deletedRole = await this.rService.destroyById(id, { session });
            if(!deletedRole) throw new Error("Error: Coulnd't delete the role!");
            await session.commitTransaction();
            return res.json200(deletedRole);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyRole =  async (role, id = null) => {
        try {
            if(!role) return res.json400("Error: Missing the information to verify if the role exist!");
            const verify = await this.rService.readOneByFilter({ role });
            if(!verify) return 0;
            if(id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };

};

const rolesController = new RolesController();

export default rolesController;