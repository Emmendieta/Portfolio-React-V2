import { CategoriesModel } from "./models/categories.model.js";
import { CitiesModel } from "./models/cities.model.js";
import { ContientsModel } from "./models/continents.model.js";
import { CountriesModel } from "./models/countries.model.js";
import { EducationModel } from "./models/education.model.js";
import { HabilitesModel } from "./models/habilities.model.js";
import { PeopleModel } from "./models/people.model.js";
import { PermissionsModel } from "./models/permissions.model.js";
import { ProvincesModel } from "./models/provinces.model.js";
import { ProyectsModel } from "./models/proyects.model.js";
import { ResponsibilitiesModel } from "./models/responsibilities.model.js";
import { RolesModel } from "./models/roles.model.js";
import { SkillsModel } from "./models/skills.model.js";
import { SocialMediasModel } from "./models/socials.model.js";
import { UsersModel } from "./models/users.model.js";
import { WorksModel } from "./models/works.model.js";

//Construir un tree para los populates:
const buildPopulateTree = (paths = []) => {
    const tree = {};
    paths.forEach(path => {
        const parts = path.split(".");
        let current = tree;
        parts.forEach(part => {
            if (!current[part]) { current[part] = {}; }
            current = current[part];
        });
    });
    return tree;
};

//Convierto el tree en un populate valido para mongoose
const treeToPopualte = (tree) => {
    return Object.entries(tree).map(([key, value]) => {
        if (Object.keys(value).length === 0) { return { path: key }; }
        return {
            path: key,
            populate: treeToPopualte(value)
        };
    });
};

class DaoMongo {
    constructor(model) { this.model = model; };
    createOne = async (data, options = {}) => await this.model.create([data], options).then(res => res[0]);
    createMany = async (data, options = {}) => await this.model.insertMany(data, options);
    readIfExistMany = async (field, values) => { return await this.model.find({ [field]: { $in: values } }); };
    readAll = async () => await this.model.find();
    readById = async (id) => await this.model.findById(id);
    readAllAndPopulate = async (populateFields = []) => {
        try {
            let query = this.model.find();
            if (populateFields.length > 0) {
                const tree = buildPopulateTree(populateFields);
                const populate = treeToPopualte(tree);
                populate.forEach(pop => { query = query.populate(pop); });
            };
            return await query.exec();
        } catch (error) {
            console.error("Error in read All and populate: ", error);
            throw new Error("Error while fetching the data from DB!");
        }
    };
    readAllAndPopulateFilters = async (populateFields = [], filters = {}) => {
        try {
            let query = this.model.find(filters);
            if (populateFields.length > 0) {
                const tree = buildPopulateTree(populateFields);
                const populate = treeToPopualte(tree);
                populate.forEach(pop => { query = query.populate(pop); });
            };
            return await query.exec();
        } catch (error) {
            console.error("Error in read All and populate: ", error);
            throw new Error("Error while fetching the data from DB!");
        }
    };
    readByIdAndPopulate = async (id, populateFields = []) => {
        try {
            let query = this.model.findById(id);
            if (populateFields.length > 0) {
                const tree = buildPopulateTree(populateFields);
                const populate = treeToPopualte(tree);
                populate.forEach(pop => { query = query.populate(pop); });
            };
            return await query.exec();
        } catch (error) {
            console.error("Error in read by Id and populate: ", error);
            throw new Error("Error while fetching the data form DB!");
        }
    };
    readByFilter = async (filter) => {
        try {
            if (!filter || typeof filter !== "object" || Array.isArray(filter)) { throw new Error("Invaliid filter object!"); };
            const safeFilter = Object.assign({}, filter);
            for (const key in safeFilter) {
                if (safeFilter.hasOwnProperty(key)) {
                    const value = safeFilter[key];
                    if (typeof value === "string" && key !== "id") { safeFilter[key] = { $regex: value, $options: "i" }; };
                };
            };
            return await this.model.find(safeFilter);
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
    readOneByFilter = async (filter) => {
        try {
            if (filter && typeof filter === "object" && !Array.isArray(filter)) {
                filter = Object.assign({}, filter);
            } else { throw new Error("Invalid ilter object!"); };
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (typeof filter[key] === "string" && key !== "_id") { filter[key] = { $regex: filter[key], $options: "i" }; };
                };
            };
            return await this.model.findOne(filter);
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };

    updateById = async (id, data, options = {}) => await this.model.findByIdAndUpdate(id, data, { new: true, ...options });
    updateManyByFilter = async (filter = {}, update = {}, options = {}) => {
        try {
            if (!filter || typeof filter !== "object" || Array.isArray(filter)) throw new Error("Error: Invalid filter object to update many!");
            if (!update || typeof update !== "object" || Array.isArray(update)) throw new Error("Error: Invalid update object to update many!");
            return await this.model.updateMany(filter, update, options);
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
    updateOrderDragDrop = async (orderedIds) => {
        try {
            if (!Array.isArray(orderedIds)) throw new Error("Ordered Ids must be an Array!");
            const orderOps = orderedIds.map((id, index) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { order: index },
                },
            }));
            const result = await this.model.bulkWrite(orderOps);
            return result;
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
    readLasyByOrder = async () => await this.model.findOne().sort({ order: -1 });
    destroyById = async (id, options = {}) => await this.model.findByIdAndDelete(id, options);
    destroyManyByFilter = async (filter = {}, options = {}) => {
        try {
            if (!filter || typeof filter !== "object" || Array.isArray(filter)) throw new Error("Error: Invalid filter to delete many!");
            if (Object.keys(filter).length === 0) throw new Error("Error: Empty filter is not allowed for Delete Many!");
            return await this.model.deleteMany(filter, options);
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
    totalElements = async () => await this.model.countDocuments();
    reorderAfterDelete = async () => {
        const docs = await this.model.find().sort({ order: 1 });
        const orderOps = docs.map((doc, index) => ({
            updateOne: {
                filter: { _id: doc_id },
                update: { order: index }
            },
        }));
        if (orderOps.length > 0) await this.model.bulkWrite(orderOps);
    };
    paginate = async ({ page = 1, limit = 10, filter = {}, populateFields = [], sort = {} }) => {
        try {
            if (!this.model.paginate) throw new Error("Model does not support paginate!");
            const opts = { page: Number(page), limit: Number(limit), sort, lean: true };
            if (populateFields.length > 0) {
                const tree = buildPopulateTree(populateFields);
                const populate = treeToPopualte(tree);
                options.populate = populate;
            };
            return await this.model.paginate(filter, opts);
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
    paginateAggregate = async ({ page = 1, limit = 10, pipeline = [], sort = {} }) => {
        try {
            const skip = (Number(page) - 1) * Number(limit);
            const agregatePipeline = [...pipeline, ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
            {
                $facet: {
                    docs: [
                        { $skip: skip },
                        { $limit: Number(limit) }
                    ],
                    totalDocs: [{ $count: "count" }]
                }
            }
            ];
            const resultArray = await this.model.aggregate(agregatePipeline).exec();
            const result = resultArray[0] || { docs: [], totalDocs: [] };
            const totalDocs = result.totalDocs[0]?.count || 0;
            const totalPages = Math.ceil(totalDocs / limit) || 1;
            return { docs: result.docs || [], totalDocs, totalPages, page: Number(page), limit: Number(limit) };
        } catch (error) {
            console.error("DaoMongo Error: ", error);
            throw error;
        }
    };
};

const categoriesManger = new DaoMongo(CategoriesModel);
const citiesManager = new DaoMongo(CitiesModel);
const continentsManager = new DaoMongo(ContientsModel);
const countriesManager = new DaoMongo(CountriesModel);
const educationMananger = new DaoMongo(EducationModel);
const peopleManager = new DaoMongo(PeopleModel);
const permissionsManager = new DaoMongo(PermissionsModel);
const provincesManager = new DaoMongo(ProvincesModel);
const proyectsManager = new DaoMongo(ProyectsModel);
const rolesManager = new DaoMongo(RolesModel);
const skillsMananger = new DaoMongo(SkillsModel);
const socialsManager = new DaoMongo(SocialMediasModel);
const usersManager = new DaoMongo(UsersModel);
const worksManager = new DaoMongo(WorksModel);
const habilitiesManager = new DaoMongo(HabilitesModel);
const responsibilitiesManager = new DaoMongo(ResponsibilitiesModel);


export {
    categoriesManger, citiesManager, continentsManager, countriesManager, educationMananger, peopleManager,
    permissionsManager, provincesManager, proyectsManager, rolesManager, skillsMananger, socialsManager, usersManager,
    worksManager, habilitiesManager, responsibilitiesManager
};