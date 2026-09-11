import mongoose, { isValidObjectId } from "mongoose";
import socialsService from "../services/socials.service.js";

class SocialsController {
    constructor() {
        this.sService = socialsService;
    };

    createSocial = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if(!data || !data.name || !data.url) throw new Error("Error: Missing information to create the social network!");
            const files = req.files || [];
            const socialPath = "socials";
            const verify = await this.verifyName(data.name);
            if(verify === 1) throw new Error("Error: The name of the social network alredy exist!");
            const totalElements = await this.sService.totalElements();
            data.order = totalElements + 1;
            //const social = await this.sService.createOneWithImages(data, files, socialPath, session);
            const social = await this.sService.createOneWithImages(data, files, socialPath);
            if(!social) throw new Error("Error: Couldn't create the social network!");
            //await session.commitTransaction();
            return res.json201(social);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    getAllSocial = async (req, res) => {
        try {
            const socials = await this.sService.readAll();
            if(!socials || socials.length === 0) throw new Error("Error: Socials not found!");
            return res.json200(socials);
        } catch (error) {
            return res.json500(error.message);
        }
    };
    
    getSocialsByFilter = async (req, res) => {
        try {
            let filter = req.query || {};
            filter = Object.assign({}, filter);
            if(Object.keys(filter).length === 0) throw new Error("Error: Missing filter/s to get the socials!");
            for(const key in filter) {
                if(filter.hasOwnProperty(key)) {
                    if(!isNaN(filter[key]) && filter[key] !== "") {
                        filter[key] = Number(filter[key]);
                    };
                };
            };
            const socials = await this.sService.readByFilter(filter);
            if(!socials || socials.length === 0) throw new Error("Error: Socials not found!");
            return res.json200(socials);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getSocialById = async (req, res) => {
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Social!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the social network!");
            const social = await this.sService.readById(id);
            if(!social) throw new Error("Error: Social network not found!");
            return res.json200(social);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    getSocialByFilter = async (req, res) => {
        try {
            const filter = req.query || {};
            if(Object.key(filter).length === 0) throw new Error("Error: Missing the filter/s to get the social network!");
            const social = await this.sService.readOneByFilter(filter);
            if(!social) throw new Error("Error: Social network not found!");
            return res.json200(social);
        } catch (error) {
            return res.json500(error.message);
        }
    };

    updateSocialById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Social!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the social network!");
            const data = req.body;
            if(!data || !data.name || !data.url) throw new Error("Error: Missing information to update the social network!");
            const files = req.files || [];
            if(data.existingImages && typeof data.existingImages === "string") data.existingImages = JSON.parse(data.existingImages);
            const social = await this.sService.readById(id);
            if(!social) throw new Error("Error: Social network not found!");
            const verify = await this.verifyName(data.name, id);
            if(verify === 1) throw new Error("Error: The name of the social network alredy exist!");
            const socialsPath = `socials/${id.toString()}`;
            //const updatedSocial = await this.sService.updateOneWithImages(social, data, files, socialsPath, session);
            const updatedSocial = await this.sService.updateOneWithImages(social, data, files, socialsPath);
            if(!updatedSocial) throw new Error("Error: Couldn't update the social network!");
            //await session.commitTransaction();
            return res.json200(updatedSocial);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally { 
            //await session.endSession();
        }
    };

    updateSocialsOrder = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const data = req.body;
            if(!Array.isArray(data) || data.length === 0) return res.json400("No ordered socials was provided!");
            const socialesOrderUpdate = await this.sService.updateOrderDragDrop(data);
            if(!socialesOrderUpdate) return res.json500("Error in updating the order of the Socials!");
            //await session.commitTransaction();
            return res.json200(socialesOrderUpdate);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally {
            //await session.endSession();
        }
    };

    deleteSocialById = async (req, res) => {
        //const session = await mongoose.startSession();
        //session.startTransaction();
        try {
            const { id } = req.params;
            if(!id) throw new Error("Error: Missing the Id of the Social network!");
            if(!isValidObjectId(id)) throw new Error("Error: Invalid Id of the Social Network!");
            const social = await this.sService.readById(id);
            if(!social) throw new Error("Error: Social network not found!");
            const folder = "socials";
            const deleteFolder = await this.sService.destroyFolder(id, folder);
            if(!deleteFolder) throw new Error("Error: Couldn't delete the folder from Cloudinary!");
            const deletedSocial = await this.sService.destroyById(id);
            if(!deletedSocial) throw new Error("Error: Couldn't delete the social network!");
            //await this.sService.reorderAfterDelete(session);
            await this.sService.reorderAfterDelete();
            //await session.commitTransaction();
            return res.json200(deletedSocial);
        } catch (error) {
            //await session.abortTransaction();
            return res.json500(error.message);
        } finally { 
            //await session.endSession();
        }
    };

    verifyName = async (name, id = null) => {
        try {
            if(!name) throw new Error("Error: Missing the name of the social to verify!");
            const verify = await this.sService.readOneByFilter({ name });
            if(!verify) return 0;
            if(id && verify._id.toString() === id.toString()) return 0;
            return 1;
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const socialsController = new SocialsController();

export default socialsController;