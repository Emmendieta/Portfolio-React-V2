import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";
import { generateFileImageHash } from "./hash.helpler.js";

export const uploadImage = async (fileBuffer, folderPath) => {
    return new Promise((resolve, reject) => {
        //If the file is an Array, convert to a Buffer of Node.js:
        const buffer = Buffer.from(fileBuffer);
        //Hash to compare if alredy existe the image:
        const hash = generateFileImageHash(buffer);
        //Create a stream to upload the image:
        const stream = cloudinary.uploader.upload_stream({
            folder: folderPath,
            resource_type: "image",
            transformation: [{ 
                width: 600,
                height: 600,
                crop: "limit"
            },{
                quality: "auto",
                fetch_format: "auto"
            }]
        }, (error, result) => {
            if (error) {
                console.error("Error uploading image: ", error);
                return reject("Error uploading image to Cloudinary!");
            };
            resolve({
                publicId: result.public_id,
                url: result.url,
                width: result.width,
                height: result.height,
                hash
            });
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

//Delete image from Cloudinary:

export const deleteImageFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
        console.warn("Image deleted from Cloudinary: ", result);
        return result;
    } catch (error) {
        console.error("Error deleting image from Cloudinary: ", error);
        throw new Error("Error deleting image from Cloudinary: ", error);
    }
};

//Delete Folder from Cloudinary:

export const deleteFolderFromCloudinary = async(folderPath) => {
    try {
        await cloudinary.api.delete_resources_by_prefix(folderPath, { invalidate: true });
        await cloudinary.api.delete_folder(folderPath);
        console.warn("Folder deleted with the image from Cloudinary");
        return true;
    } catch (error) {
        console.warn("Error: Deleting folder from Cloudinary: ", error);
        throw error;
    }
};