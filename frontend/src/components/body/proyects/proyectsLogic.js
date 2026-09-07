import { bulkUpdateData, createDataWithImages, deleteData, getData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, getDataPopulateFilter, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateProyectWithImages = async (data) => {
    try {
        if (!data) throw new Error("Error: Missing the information to create the proyect!");
        const url = "proyects";
        const formData = new FormData();
        //Simple fields:
        Object.keys(data).forEach((key) => { if (key !== "images" && typeof data[key] !== "object") formData.append(key, data[key]); });
        if(data.dateEnd) formData.append("dateEnd", data.dateEnd);
        //Objects -> stringify:
        formData.append("name", JSON.stringify(data.name));
        formData.append("company", JSON.stringify(data.company));
        formData.append("description", JSON.stringify(data.description));
        ///Skills:
        if (Array.isArray(data.skills)) {
            const skillsIds = data.skills.map(skill => skill._id);
            formData.append("skills", JSON.stringify(skillsIds));
        };
        //Categories:
        if (Array.isArray(data.categories)) {
            const categoriesIds = data.categories.map(category => category._id);
            formData.append("categories", JSON.stringify(categoriesIds));
        };
        //Responsibilities:
        console.log("LOGIC", data.responsibilities);
        if (Array.isArray(data.responsibilities)) {
            const responsibilitiesIds = data.responsibilities.map(responsibility => responsibility._id);
            formData.append("responsibilities", JSON.stringify(responsibilitiesIds));
        };
        //Files:
        if (data.images && data.images.length > 0) {
            data.images.forEach((img) => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if (!dataResponse) throw new Error("Error: Couldn't create the proyect!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllProyects = async () => {
    try {
        const url = "proyects";
        const dataResponse = await getData(url);
        if(!dataResponse) throw new Error("Error: Couldn't get all the proyects or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllProyectsPopulate = async () => {
    try {
        const url = "proyects";
        const populateFields = ["skills", "categories", "responsibilities"];
        const dataResponse = await getDataPopulate(url, populateFields);
        if (!dataResponse) throw new Error("Error in fetch get all proyects populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllProyectsPopulateFilter = async (categoryId = null) => {
    try {
        const url = "proyects";
        const populateFields = ["skills", "categories", "responsibilities"];
        const filters = categoryId ? { category: categoryId }: {};
        const dataResponse = await getDataPopulateFilter(url, populateFields, filters);
        if (!dataResponse) throw new Error("Error in fetch get all proyects populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllProyectsPopulatePaginate = async ({ page = 1, limit = 10, language = "es" }) => {
    try {
        const url = "proyects";
        const dataResponse = await getDataPagintePopulate(url, { page, limit, language });
        if (!dataResponse) throw new Error("Error in fetch get all proyects populate and paginate or no data availalbe!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetProyectByIdPopulate = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the proyect!");
        const url = `proyects/${id}`;
        const populateFields = ["skills", "categories", "responsibilities"];
        const dataResponse = await getDataByIdPopulate(url, populateFields);
        if (!dataResponse) throw new Error("Error in fetch get proyect by Id and populate or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateProyectByIdWithImages = async (id, data) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the proyect!");
        if (!data) throw new Error("Error: Missing the information to update the proyect!");
        const url = `proyects/${id}`;
        const formData = new FormData();
        //Simple fields:
        const simpleFields = ["dateStart", "linkProyect", "linkCompany"];
        simpleFields.forEach(key => { if (data[key] !== undefined) formData.append(key, data[key]); });
        if(data.dateEnd) formData.append("dateEnd", data.dateEnd);
        //Objects -> stringify:
        if (data.name) formData.append("name", JSON.stringify(data.name));
        if (data.company) formData.append("company", JSON.stringify(data.company));
        if (data.description) formData.append("description", JSON.stringify(data.description));
        ///Skills:
        if (Array.isArray(data.skills)) {
            const skillsIds = data.skills.map(skill => skill._id);
            formData.append("skills", JSON.stringify(skillsIds));
        };
        //Categories:
        if (Array.isArray(data.categories)) {
            const categoriesIds = data.categories.map(category => category._id);
            formData.append("categories", JSON.stringify(categoriesIds));
        };
        //Responsibilities:
        if (Array.isArray(data.responsibilities)) {
            const responsibilitiesIds = data.responsibilities.map(responsibility => responsibility._id);
            formData.append("responsibilities", JSON.stringify(responsibilitiesIds));
        };
        //Files:
        if (data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, url: img.url, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //Nuevas imagenes:
        if (data.images && data.images.length > 0) {
            data.images.forEach(img => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        console.log("IMAGES", data.images);
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if (!dataResponse) throw new Error("Error in fetch update proyect with images or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateProyecsOrder = async (orderedProyects) => {
    try {
        if(!Array.isArray(orderedProyects) || orderedProyects.length === 0) throw new Error("Error: No ordered Proyects was provived!");
        const dataArray = orderedProyects.map((proyect, index) => {
            if(!proyect._id || proyect._id.length !== 24) throw new Error("Error: Invalid Id!");
            return { _id: proyect._id, order: index + 1 };
        });
        const url = "proyects/reorder";
        const dataResponse = await bulkUpdateData(url, dataArray);
        if(!dataResponse) throw new Error("Error: Couldn't update the order of the Proyects!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteProyectById = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id to delete the proyect!");
        const url = `proyects/${id}`;
        const dataResponse = await deleteData(url);
        if (!dataResponse) throw new Error("Error in fetch delete proyect by Id or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};