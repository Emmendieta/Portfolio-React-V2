import { bulkUpdateData, createData, createDataWithImages, deleteData, getData, getDataById, updateDataById, updateDataByIdWithImages } from "../../../helpers/crud.helper.js";

export const fetchCreateCategory = async (data) => {
    try {
        const url = "categories";
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error in fetch create category!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchCreateCategoryWithImages = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the category!");
        const url = "categories";
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if (key !== "images" && typeof data[key] !== "object") formData.append(key, data[key]); });
        //Objects -> Stringify:
        formData.append("name", JSON.stringify(data.name));
        //Files:
        if(data.images && data.images.length > 0) {
            data.images.forEach((img) => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't create the Category!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

//FALTA DESPUES MEJORAR PARA SUBIR CON IMAGENES
export const fetchCreateManyCategories = async (data) => {
    try {
        if(!Array.isArray(data) || data.length === 0) throw new Error("Error:Couldn´t get the Categories to create!");
        const url = "categories/many";
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create many Categories!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllCategories = async () => {
    try {
        const url =`categories`;
        const dataResponse = await getData(url);
        if(!dataResponse) throw new Error("Error in fetch get all Categories or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetCategoryById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the category!");
        const url = `categories/${id}`;
        const dataResponse = await getDataById(url);
        if(!dataResponse) throw new Error("Error in fetch get category by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateCategoryById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the category!");
        const url = `categories/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error in fetch update category by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateCategoryByIdWithImages = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the category!");
        if(!data) throw new Error("Error: Missing the information to update the category!");
        const url = `categories/${id}`;
        const formData = new FormData();
        //Simple Fields:
        const simpleFields = ["order"];
        simpleFields.forEach(key => { if (data[key] !== undefined) formData.append(key, data[key]); });
        //Objects -> Stringify;
        if(data.name) formData.append("name", JSON.stringify(data.name));
        //Files:
        if(data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //New Files (Img):
        if(data.images && data.images.length > 0) {
            data.images.forEach(img => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the category!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateCategoriesOrder = async (orderedCategories) => {
    try {
        if(!Array.isArray(orderedCategories || orderedCategories.length === 0)) throw new Error("Error: No ordereded Categories was provided!");
        const dataArray = orderedCategories.map((category, index) => {
            if(!category._id || category._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: category._id, order: index + 1 };
        });
        const url = `categories/reorder`;
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error("Error: Couldn't updte the order of the Categories!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteCategoryById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Category!");
        const url = `categories/${id}`;
        const dataResponse = await deleteData(url);
        if(!dataResponse) throw new Error("Error: Couldn't delete the Category!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};