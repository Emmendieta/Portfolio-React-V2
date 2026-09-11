import { bulkUpdateData, createDataWithImages, deleteData, getData, getDataByIdPopulate, getDataPopulate, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateEducationWithIamges = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the Education!");
        const url = "educations";
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if(key !== "images" && typeof data[key] !== "object") formData.append(key, data[key])});
        //Objects -> Stringify:
        formData.append("institutionName", JSON.stringify(data.institutionName));
        formData.append("title", JSON.stringify(data.title));
        formData.append("description", JSON.stringify(data.description));
        //Habilities:
        if(Array.isArray(data.habilities)) {
            const habilitiesIds = data.habilities.map(hability => hability._id);
            formData.append("habilities", JSON.stringify(habilitiesIds));
        };
        //Files:
        if(data.images && data.images.length > 0) {
            data.images.forEach((img) => { if(img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't create the Education!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllEducations = async () => {
    try {
        const url = "educations";
        const dataResponse = await getData(url);
        if(!dataResponse) throw new Error("Error in fetch get all Educations or no data availalbe!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
}

export const fetchGetAllEducationsPopulate = async () => {
    try {
        const url = "educations";
        const populateFields = ["habilities"];
        const dataResponse = await getDataPopulate(url, populateFields);
        if(!dataResponse) throw new Error("Error in fetch Educactions populates or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetEduactionPopulateById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Education!");
        const url = `educations/${id}`;
        const populateFields = ["habilities"];
        const dataResponse = await getDataByIdPopulate(url, populateFields);
        if(!dataResponse) throw new Error("Error in fetch get Education by Id and populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateEducationByIdWithImages = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Education!");
        if(!data) throw new Error("Error: Missing the information to update the Education!");
        const url = `educations/${id}`;
        const formData = new FormData();
        //Simple Fields:
        const simpleFields = ["linkInstitution", "linkCertificate"];
        simpleFields.forEach(key => { if(data[key] !== undefined) formData.append(key, data[key])});
        //Objects -> Stringify:
        if(data.institutionName) formData.append("institutionName", JSON.stringify(data.institutionName));
        if(data.title) formData.append("title", JSON.stringify(data.title));
        if(data.description) formData.append("description", JSON.stringify(data.description));
        //habilities:
        if(Array.isArray(data.habilities)) {
            const habilitiesIds = data.habilities.map(hability => hability._id);
            formData.append("habilities", JSON.stringify(habilitiesIds));
        };
        //Existing Images:
        if(data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId,isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //New Images:
        if(data.images && data.images.length > 0) {
            data.images.forEach(img => { if(img.file instanceof File) formData.append("images", img.file)});
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the Education!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateEducationsOrder = async (orderedEducations) => {
    try {
        if(!Array.isArray(orderedEducations) || orderedEducations.length === 0) throw new Error("Error: No ordered Educations was provided!");
        const dataArray = orderedEducations.map((education, index) => {
            if(!education._id || education._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: education._id, order: index + 1 };
        });
        const url = "educations/reorder";
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error ("Error: Couldn't update the order ot the Educations!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
}

export const fetchDeleteEducationById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Education!");
        const url = `educations/${id}`;
        const dataResponse = await deleteData(url);
        if(!dataResponse) throw new Error("Error: Couldn't delete the Educaction!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};