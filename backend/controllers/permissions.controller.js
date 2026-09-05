import mongoose, { isValidObjectId } from "mongoose";
import permissionsService from "../services/permissions.service.js";
import rolesService from "../services/roles.service.js";
import usersService from "../services/users.service.js";
import { parseBracketQuery } from "../helpers/query.helper.js";

class PermissionsController {
    constructor() {
        this.pService = permissionsService;
        this.rService = rolesService;
        this.uService = usersService;
    };

    createPermission = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if (!data || !data.key || !data.name) throw new Error("Error: Missing information to create the permission!");
            const verifyKey = await this.verifyPermissionKey(data.key);
            if (verifyKey === 1) throw new Error("Error: The key of the permission alredy exist!");
            const permission = await this.pService.createOne(data, { session });
            if (!permission) throw new Error("Error: Couldn't create the permission!");
            await session.commitTransaction();
            return res.json201(permission);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllPermissions = async (req, res) => {
        try {
            const permissions = await this.pService.readAll();
            if (!permissions || permissions.length === 0) throw new Error("Error: No permissions found!");
            return res.json200(permissions);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPermissionsPaginate = async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = {} } = req.query;
            const verifyPage = Number(page) || 1;
            const verifyLimit = Number(limit) || 10;
            const parsedFilter = parseBracketQuery(req.query, "filter", value => JSON.parse(value));
            const parsedSort = parseBracketQuery(req.query, "sort", Number);
            const permissions = await this.pService.readPaginate({ page: verifyPage, limit: verifyLimit, filter: parsedFilter, sort: parsedSort });
            if (!permissions || !permissions.docs.length === 0) throw new Error("Error: Permissions paginate not found!");
            return res.json200(permissions);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPermissionsByFilter = async (req, res) => {
        try {
            const filter = parseBracketQuery(req.query, "filñter")
            if (Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to find the permission/s!");
            const permissions = await this.pService.readByFilter(filter);
            if (!permissions || permissions.length === 0) throw new Error("Error: Couldn't find a permission with the filter/s applied!");
            return res.json200(permissions);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getPermissionById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) throw new Error("Error: Missing the Id of the permission!");
            if (!isValidObjectId(id)) throw new Error("Error: Invalid Id of the permission!");
            const permission = await this.pService.readById(id);
            if (!permission) throw new Error("Error: Couldn't found the permission!");
            return res.json200(permission);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getOnePermissionByFilter = async (req, res) => {
        try {
            const filter = parseBracketQuery(req.query, "filter");
            if (Object.keys(filter).length === 0) throw new Error("Error: Missing Filter to find the permission/s!");
            const permission = await this.pService.readOneByFilter(filter);
            if (!permission) throw new Error("Error: Couldn't find a permission with the filters applied!");
            return res.json200(permission);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updatePermissionById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the permission!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the permission!");
            const data = req.body;
            if(!data || !data.name) throw new Error("Error: Missing information to update the permission!");
            const permission = await this.pService.readById(id);
            if(!permission) throw new Error("Error: Permission not found!");
            const verify = await this.verifyPermissionKey(data.key, id);
            if(verify === 1) throw new Error("Error: The key alredy exist in an another permission!");
            const updatedPermission = await this.pService.updateById(id, data, { session });
            if(!updatedPermission) throw new Error("Error: Couldn't update the permission!");
            await session.commitTransaction();
            return res.json200(updatedPermission);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    deletePermissionById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the permission!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the permission!");
            const permission = await this.pService.readById(id);
            if(!permission) throw new Error("Error: Coulnd't found the permission!");
            const permissionObjectId = new mongoose.Types.ObjectId(id);
            const roles = await this.rService.readByFilter({ permissions: permissionObjectId });
            if(roles && roles.length > 0) {
                for(const role of roles) {
                    const permissions = role.permissions.filter(permission => permission._id.toString() !== id);
                    role.permissions = permissions;
                    await this.rService.updateById(role._id, role, { session });
                };
            };
            const users = await this.uService.readByFilter({ extraPermission: permissionObjectId });
            if(users && users.length > 0) {
                for(const user of users) {
                    const extraPermission = user.extraPermission.filter(permission => permission._id.toString() !== id);
                    user.extraPermission = extraPermission;
                    await this.uService.updateById(user._id, user, { session });
                };
            };
            const deletedPermission = await this.pService.destroyById(id, { session });
            if(!deletedPermission) throw new Error("Error: Coulnd't delete the permission!");
            await session.commitTransaction();
            return res.json200(deletedPermission);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyPermissionKey = async (key, id = null) => {
        try {
            const verify = await this.pService.readOneByFilter({ key });
            if(!verify) return 0;
            if(id && verify._id.toString() === id.toString()) return 0;
            else return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };

};

const permissionsController = new PermissionsController();

export default permissionsController;