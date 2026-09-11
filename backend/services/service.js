import mongoose from "mongoose";
import { generateFileImageHash } from "../helpers/hash.helper.js";
import { deleteFolderFromCloudinary, deleteImageFromCloudinary, uploadImage } from "../helpers/uploadImage.helper.js";
import { hash } from "bcrypt";

class Service {
    constructor(repository) { this.repository = repository; };
    createOne = async (data, options = {}) => await this.repository.createOne(data, options);
    createOneWithImages = async (data, files, folder, session = null) => {
        const objId = new mongoose.Types.ObjectId();
        data._id = objId;
        let images = [];
        const folderPath = `portfolio/${folder}/${objId.toString()}`;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const uploaded = await uploadImage(file.buffer, folderPath);
                images.push({ publicId: uploaded.publicId, url: uploaded.url, width: uploaded.width, height: uploaded.height, hash: uploaded.hash, isMain: i === 0 });
            };
        };
        data.images = images;
        return await this.createOne(data, session ? { session } : {});
    };
    createMany = async (data, options = {}) => await this.repository.createMany(data, options);
    readAll = async () => await this.repository.readAll();
    readById = async (id) => await this.repository.readById(id);
    readIfExistMany = async (field, values) => await this.repository.readIfExistMany(field, values);
    readByFilter = async (filter) => await this.repository.readByFilter(filter);
    readOneByFilter = async (filter) => await this.repository.readOneByFilter(filter);
    readAllAndPopulate = async (populateFields = []) => await this.repository.readAllAndPopulate(populateFields);
    readAllAndPopulateFilters = async (populateFields = [], filters = {}) => await this.repository.readAllAndPopulateFilters(populateFields, filters);
    readByIdAndPopulate = async (id, populateFields = []) => await this.repository.readByIdAndPopulate(id, populateFields);
    updateById = async (id, data, options = {}) => await this.repository.updateById(id, data, options);
    updateOneWithImages = async (obj, data, files, folder, session = null) => {
        try {
            const imagesToKeep = Array.isArray(data.existingImages) ? data.existingImages : [];
            const currentImages = obj.images || [];
            const imagesToDelete = currentImages.filter(img => !imagesToKeep.some(keep => keep.publicId === img.publicId));
            for (const img of imagesToDelete) {
                await deleteImageFromCloudinary(img.publicId);
                console.warn("Image deleted from Cloudinary: ", img.publicId);
            };
            let finalImages = currentImages.filter(img => imagesToKeep.some(keep => keep.publicId === img.publicId)).map(img => {
                const updated = imagesToKeep.find(keep => keep.publicId === img.publicId);
                return { ...img.toObject(), isMain: updated?.isMain || false };
            });
            if (files && files.length > 0) {
                for (const file of files) {
                    const buffer = Buffer.from(file.buffer);
                    const newHash = generateFileImageHash(buffer);
                    const alredyExists = finalImages.some(img => img.hash === newHash);
                    if (alredyExists) {
                        console.error("Error: Image duplicate, will nop upload!");
                        continue;
                    };
                    const uploaded = await uploadImage(buffer, `portfolio/${folder}`);
                    finalImages.push({ publicId: uploaded.publicId, url: uploaded.url, width: uploaded.width, height: uploaded.height, hash: uploaded.hash, isMain: false });
                };
            };
            if (finalImages.length > 0) {
                const mainImages = finalImages.filter(img => img.isMain);
                if (mainImages.length === 0) finalImages[0].isMain = true;
                if (mainImages.length > 1) throw new Error("Error: Only one image con be main!");
                const mainImage = finalImages.find(img => img.isMain);
                finalImages = [mainImage, ...finalImages.filter(img => img.publicId !== mainImage.publicId)];
            };
            data.images = finalImages;
            delete data.existingImages;
            const updatedObj = await this.updateById(obj._id, data, session ? { session } : {});
            if (!updatedObj) throw new Error("Error updating object!");
            return updatedObj;
        } catch (error) {
            throw error;
        }
    };
    updateManyByFilter = async (filter, update, options = {}) => await this.repository.updateManyByFilter(filter, update, options);
    updateOrderDragDrop = async (orderedIds) => await this.repository.updateOrder(orderedIds);
    readLastByOrder = async () => await this.repository.readLastByOrder();
    destroyById = async (id, options = {}) => await this.repository.destroyById(id, options);
    destroyManybyFilter = async (filter, options = {}) => await this.repository.destroyManybyFilter(filter, options);
    totalElements = async () => await this.repository.totalElements();
    destroyFolder = async (id, folder) => {
        try {
            const folderPath = `portfolio/${folder}/${id}`;
            return await deleteFolderFromCloudinary(folderPath);
        } catch (error) {
            throw error;
        }
    };
    reorderAfterDelete = async (session = null) => await this.repository.reorderAfterDelete(session);
    readPaginate = async (options) => await this.repository.paginate(options);
    readPaginateAggregate = async (options) => await this.repository.paginateAggregate(options);
};

export default Service;