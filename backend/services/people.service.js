import { generateFileImageHash } from "../helpers/hash.helper.js";
import { deleteFolderFromCloudinary, deleteImageFromCloudinary, uploadImage } from "../helpers/uploadImage.helper.js";
import { peopleRepository } from "../repositories/repository.js";
import Service from "./service.js";

class PeopleService extends Service {
    constructor() { super(peopleRepository); };
    
    //Particular Methods:
    createPersonWithImages = async(data, files, session = null) => {
        if(data.dni) {
            let images = [];
            if(files && files.length > 0) {
                for(let i=0; i<files.length; i++) {
                    const file = files[i];
                    const uploaded = await uploadImage(file.buffer, `portfolio/people/${data.dni}`);
                    images.push({
                        publicId: uploaded.publicId, url: uploaded.url, width: uploaded.width, height: uploaded.height, hash: uploaded.hash, isMain: i === 0
                    });
                };
            };
            data.images = images;
            return await this.createOne(data, session ? {session}: {});
        };
    };

    updatePersonWithImages = async(personalbar, data, files, session = null) => {
        try {
            const imagesTokeep = Array.isArray(data.existingImages) ? data.existingImages: [];
            const currentImages = person.images || [];
            const imagesToDelete = currentImages.filter(img => !imagesTokeep.some(keep => keep.publicId === img.publicId));
            for(const img of imagesToDelete) {
                await deleteImageFromCloudinary(img.publicId);
                console.warn("Image delted from Cloudinary: ", img.publicId);
            };
            let finalImages = currentImages.filter(img => imagesTokeep.some(keep => keep.publicId === img.publicId)).map(img => {
                const updated = imagesTokeep.find(keep => keep.publicId === img.publicId);
                return { ...img.toObject(), isMain: updated?.isMain || false };
            });
            if(files && files.length > 0) {
                for(const file of files) {
                    const buffer = Buffer.from(file.buffer);
                    const newHash = generateFileImageHash(buffer);
                    const alredyExist = finalImages.some(img => img.hash === newHash);
                    if(alredyExist) {
                        console.error("Error: Image duplicate, will no upload!");
                        continue;
                    };
                    const uploaded = await uploadImage(buffer, `portfolio/people/${data.dni}`);
                    finalImages.push({ publicId: uploaded.publicId, url: uploaded.url, width: uploaded.width, height: uploaded.height, hash: uploaded.hash, isMain: false });
                };
            };
            if(finalImages.length > 0) {
                const mainImages = finalImages.filter(img => img.isMain);
                if(mainImages.length === 0) finalImages[0].isMain = true;
                if(mainImages.length > 1) throw new Error("Error: Only one image can be main!");
                const mainImage = finalImages.find(img => img.isMain);
                finalImages = [mainImage, ...finalImages.filter(img => img.publicId !== mainImage.publicId)];
            };
            data.images = finalImages;
            delete data.existingImages;
            const updatePerson = await this.updateById(person.id, data, session ? { session }: {});
            if(!updatePerson) throw new Error("Error updating person!");
            return updatePerson;
        } catch (error) {
            throw error;
        }
    };
};

const peopleService = new PeopleService();

export default peopleService;