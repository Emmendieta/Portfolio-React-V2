import mongoose, { isValidObjectId } from "mongoose";
import categoriesService from "../services/categories.service.js";
import proyectsService from "../services/proyects.service.js";

class CategoriesController {
    constructor() { 
        this.cService = categoriesService; 
        this.pService = proyectsService;
    };

    createCategory = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            const files = req.files;
            const categoryPath = "categories";
            if(!data || !data.name) throw new Error("Error: Missing the information to create the Category!");
            if(!files) throw new Error("Error: No image sent to upload!");
            data.name = JSON.parse(data.name);
            let verify = await this.verifyName(data.name);
            if(verify === 1) throw new Error("Error: The name of the Category alredy exist!");
            const totalElements = await this.cService.totalElements();
            data.order = totalElements + 1;
            const category = await this.cService.createOneWithImages(data, files, categoryPath, session);
            if(!category) throw new Error("Error: Couldn't create the Category!");
            await session.commitTransaction();
            return res.json201(category);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    createManyCategories = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            console.log("INGRESO ACA")
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) throw new Error("Error: Missing the information to create many Categories!");
            //Verify names:
            const names = data.map(category => category.name?.es);
            if(names.some(name => !name)) throw new Error("Error: Missing some Name of some category to create!");
            //Verify duplicate names:
            const uniqueNames = new Set(names.map(name => name.trim().toLowerCase()));
            if(uniqueNames.size !== names.length) throw new Error("Error: There are duplicated Categories names!");
            //Verify names on DB:
            const existingCategories = await this.cService.readIfExistMany("name.es", names);
            if(existingCategories.length > 0){
                const existingNames = existingCategories.map(category => category.name.get("es"));
                throw new Error(`Error: These Categories already exist: ${existingNames.join(", ")}`);
            };
            const categoriesData = data.map((category, index) => ({ ...category, order: index + 1 }));
            const categories = await this.cService.createMany(categoriesData, { session });
            if(!categories || categories.length === 0) throw new Error("Error: Couldn't create many Categories!");
            await session.commitTransaction();
            return res.json200(categories);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    getAllCategories = async (req, res) => {
        try {
            const categories = await this.cService.readAll();
            if(!categories || categories.length === 0) return res.json404("Error: No Categories found!");
            return res.json200(categories);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCategoriesByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.keys(filter).length === 0) return res.json400("Error: Filter is needed to get the Categories!");
            const categories = await this.cService.readByFilter(filter);
            if(!categories || categories.length === 0) return res.json404("Error: No Categories found!");
            return res.json200(categories);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) return res.json400("Error: Id is needed!");
            if(!isValidObjectId(id)) return res.json400("Error: Invalid Id!");
            const category = await this.cService.readById(id);
            if(!category) return res.json404("Error: No category found!");
            return res.json200(category);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getCategoryByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(!filter || filter.length === 0) return res.json400("Error: Filter is needed!");
            if(Object.keys(filter).length === 0) return res.json400("Error: Filter is needed!");
            const category = await this.cService.readOneByFilter(filter);
            if(!category) return res.json404("Error: No Category was found!");
            return res.json200(category);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateCategoryById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) return res.json400("Error: Id is needed!");
            if(!isValidObjectId(id)) return res.json400("Error: Invalid Id!");
            const data = req.body;
            if(!data || !data.name) return res.json400("Error: Missing information to update the Category!");
            const files = req.files;
            if(data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            const category = await this.cService.readById(id);
            if(!category) return res.json404("Error: Category not found!");
            let verify;
            if(data.name) {
                verify = await this.verifyName(data.name, id);
                if(verify === 1) return res.json400("Error: The name of the Category alredy Exist!");
            };
            data.name = JSON.parse(data.name);
            const folder = `categories/${id.toString()}`;
            const categoryUpdated = await this.cService.updateOneWithImages(category, data, files, folder, session);
            if(!categoryUpdated) return res.json404("Error: Couldn't update the Category!");
            await session.commitTransaction();
            return res.json200(categoryUpdated);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    updateCategoriesOrder = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("No ordered categories was provided!");
            const categoriesOrderUpdate = await this.cService.updateOrderDragDrop(data);
            if(!categoriesOrderUpdate) return res.json500("Error in updating the order of the categories");
            await session.commitTransaction();
            return res.json200(categoriesOrderUpdate);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            session.endSession();
        }
    };

    deleteCategoryById = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) return res.json400("Error: Id is missing!");
            if(!isValidObjectId(id)) return res.json400("Error: Invalid Id!");
            const category = await this.cService.readById(id);
            if(!category) return res.json404("Error: Category not found!");
            const categoryObjectId = new mongoose.Types.ObjectId(id);
            const proyects = await this.pService.readByFilter({ categories: categoryObjectId });
            if(proyects && proyects.length > 0 ){
                for(const proyect of proyects) {
                    const categories = proyect.categories.filter(category => category._id.toString() !== id);
                    proyect.categories = categories;
                    await this.pService.updateById(proyect._id, proyect, { session });
                };
            };
            const folder = "categories";
            const deleteFolder = await this.cService.destroyFolder(id, folder);
            if(!deleteFolder) return res.json404("Error: Couldn't deleted the Folder from Cloudinary!");
            const categoryDeleted = await this.cService.destroyById(id, { session });
            if(!categoryDeleted) return res.json400("Error: Couldn't delete the Category!");
            await this.cService.reorderAfterDelete(session);
            await session.commitTransaction();
            return res.json200(categoryDeleted);
        } catch (error) {
            await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            await session.endSession();
        }
    };

    verifyName = async (name, id = null) => {
        const query = {
            'name.en': name?.en || name,
        };
        const verify = await this.cService.readOneByFilter(query);
        if(!verify) return 0;
        if(id && verify._id.toString() === id.toString()) return 0;
        return 1;
    };
};

const categoriesController = new CategoriesController();

export default categoriesController;