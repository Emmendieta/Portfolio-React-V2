import { bulkUpdateData, createDataWithImages, getData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateWorkWithImages = async (data) => {
    try {
        if (!data) throw new Error("Error: Missing the information to create the work!");
        const url = "works";
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if (key !== "images" && typeof data[key] !== "object") formData.append(key, data[key]); });
        //Objects -> Stringify:
        formData.append("jobTitle", JSON.stringify(data.jobTitle));
        formData.append("company", JSON.stringify(data.company));
        formData.append("description", JSON.stringify(data.description));
        //Responsibilities:
        const responsibilitiesIds = data.responsibilities?.map(responsibility => responsibility._id) || [];
        formData.append("responsibilities", JSON.stringify(responsibilitiesIds));
        //Files:
        if (data.images && data.images.length > 0) {
            data.images.forEach((img) => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if (!dataResponse) throw new Error("Error: Couldn't create the Work!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllWorks = async () => {
    try {
        const url = "works";
        const dataResponse = await getData(url);
        if(!dataResponse) throw new Error("Error: Couldn't get the data of Works or not data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllWorksPopulate = async () => {
    try {
        const url = "works";
        const populateFields = ["responsibilities"];
        const dataResponse = await getDataPopulate(url, populateFields);
        if (!dataResponse) throw new Error("Error in fetch get all works populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllWorksPaginatePopulate = async ({ page = 1, limit = 10, language = "es", searchByJobTitle, searchByCompany }) => {
    try {
        const url = "works";
        const dataResponse = await getDataPagintePopulate(url, { page, limit, language, searchByJobTitle, searchByCompany });
        if (!dataResponse) throw new Error("Error in fetch get all works paginate populate");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetWorkByIdPopulate = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the work!");
        const url = `works/${id}`;
        const populateFields = ["responsibilities"];
        const dataResponse = await getDataByIdPopulate(url, populateFields);
        if (!dataResponse) throw new Error("Error in fetch get Work populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateWorkByIdWithImages = async (id, data) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the work to update!")
        if (!data) throw new Error("Error: Missing the information to update the work!");
        const url = `works/${id}`;
        const formData = new FormData();
        //Simple fields:
        const simpleFields = ["dateStart", "dateEnd", "linkCompany", "finished"];
        simpleFields.forEach(key => { if (data[key] !== undefined) formData.append(key, data[key]); });
        //Objects -> stringify:
        if (data.jobTitle) formData.append("JobTitle", JSON.stringify(data.jobTitle));
        if (data.company) formData.append("company", JSON.stringify(data.company));
        if (data.description) formData.append("description", JSON.stringify(data.description));
        //Responsibilities:
        const responsibilitiesIds = data.responsibilities?.map(responsibility => responsibility._id) || [];
        formData.append("responsibilities", JSON.stringify(responsibilitiesIds));
        //Files:
        if (data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //New Files:
        if (data.images && data.images.length > 0) {
            data.images.forEach(img => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if (!dataResponse) throw new Error("Error in fetch update work with images or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateWorksOrder = async (orderedWorks) => {
    try {
        if(!Array.isArray(orderedWorks) || orderedWorks.length === 0) throw new Error("Error: No data recived!");
        const dataArray = orderedWorks.map((work, index) => {
            if(!work._id || work._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: work._id, order: index + 1 };
        });
        const url = "works/reorder";
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error("Error: Couldn't update the order of the Works!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteWorkById = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the work to delete!");
        const url = `works/${id}`;
        const dataResponse = await deleteData(url);
        if (!dataResponse) throw new Error("Error in fetch delete work by Id or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};