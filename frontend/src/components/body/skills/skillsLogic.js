import { bulkUpdateData, createDataWithImages, deleteData, getData, getDataById, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateSkillWithImages = async (data) => {
    try {
        if (!data) throw new Error("Error: Missing the information to create the Skill!");
        const url = "skills";
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if (key !== "images" && typeof data[key] !== "object") formData.append(key, data[key]); });
        //Objects -> stringify:
        formData.append("name", JSON.stringify(data.name));
        //Files:
        if (data.images && data.images.length > 0) {
            data.images.forEach((img) => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if (!dataResponse) throw new Error("Error: Couldn't create the Skill!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllSkills = async () => {
    try {
        const url = "skills";
        const dataResponse = await getData(url);
        if (!dataResponse) throw new Error("Error in fetch get all Skills or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetSkillById = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the Skill to fetch!");
        const url = `skills/${id}`;
        const dataResponse = await getDataById(url);
        if (!dataResponse) throw new Error("Error in fetch get Skill by Id or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateSkillByIdWithImages = async (id, data) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the Skill to fetch!");
        if (!data) throw new Error("Error: Missing the information to update de Skill in the fetch!");
        const url = `skills/${id}`;
        const formData = new FormData();
        //Simple Fields:
        const simpleFields = ["percent", "order", "type"];
        simpleFields.forEach(key => { if (data[key] != undefined) formData.append(key, data[key]); });
        //Objects -> stringify:
        if (data.name) formData.append("name", JSON.stringify(data.name));
        ///Files:
        if (data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //New Files:
        if (data.images && data.images.length > 0) {
            data.images.forEach(img => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the Skill!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateSkillsOrder = async (orderedSKills) => {
    try {
        if(!Array.isArray(orderedSKills || orderedSKills.length === 0)) throw new Error("Error: No ordereded Skills was provided!");
        const dataArray = orderedSKills.map((skill, index) => {
            if(!skill._id || skill._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: skill._id, order: index + 1 };
        });
        const url = `skills/reorder`;
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error("Error: Couldn't update the order of the Sklills!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteSkillById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Skill to delete!");
        const url = `skills/${id}`;
        const dataResponse = await deleteData(url);
        if(!dataResponse) throw new Error("Error: Couldn't delete the Skill!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};