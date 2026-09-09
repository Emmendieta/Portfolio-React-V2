import { AR } from "country-flag-icons/react/3x2";
import { bulkUpdateData, createDataWithImages, deleteData, getData, getDataByFilter, getDataById, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateSocialWithImages = async (data) => {
    try {
        if(!data) throw new Error("Error: Missing the information to create the Social Network!");
        const url = `socials`;
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if(key !== "images" && typeof data[key] !== "object") formData.append(key, data[key])});
        //Files:
        if(data.images && data.images.length > 0) {
            data.images.forEach((img) => { if(img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't create the social network!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllSocials = async () => {
    try {
        const url = "socials";
        const dataResponse = await getData(url);
        if(!dataResponse) throw new Error("Error: Couldn't get all the social medias!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetSocialByFilter = async (filter) => {
    try {
        if(!filter) throw new Error("Error: Missing the filter to search the social network!");
        const url = "socials/filt/filter";
        const dataResponse = await getDataByFilter(url, filter);
        if(!dataResponse) throw new Error("Error: Couldn't get the socials medias by filter!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetSocialById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the social network!");
        const url = `socials/${id}`;
        const dataResponse = await getDataById(url);
        if(!dataResponse) throw new Error("Error: Couldn't get the social network by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateSocialWithImages = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the social network!");
        if(!data) throw new Error("Error: Missing the information to update the social network!");
        const url = `socials/${id}`;
        const formData = new FormData();
        //Simple Fields:
        const simpleFields = ["name", "url", "typeSocial", "user", "password"];
        simpleFields.forEach(key => { if(data[key] !== undefined) formData.append(key, data[key])});
        //Existing Images:
        if(data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //New images:
        if(data.images && data.images.length > 0) {
            data.images.forEach(img => { if(img.file instanceof File) formData.append("images", img.file)});
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the Social Network!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateSocialsOrder = async (orderedSocials) => {
    try {
        if(!Array.isArray(orderedSocials) || orderedSocials.length === 0) throw new Error("Error: No ordered Social was provided!");
        const dataArray = orderedSocials.map((social, index) => {
            if(!social._id || social._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: social._id, order: index + 1 };
        });
        const url = "socials/reorder";
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error("Error: Couldn't update the order of the Socials!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteSocialById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the social network!");
        const url = `socials/${id}`;
        const dataResponse = await deleteData(url);
        if(!dataResponse) throw new Error("Error: Couldn't delete the social network!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};