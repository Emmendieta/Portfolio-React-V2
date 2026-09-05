import { createData, createDataWithImages, deleteData, getData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchPerson = async () => {
    try {
        const url ="people";
        const data = await getData(url);
        if(!data || data.length === 0) throw new Error("Error: Coulnd't get the information of the person!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchCreatePerson = async (data) => {
    try {
        if(!data) throw new Error("Error: Missing the information to create the Person!");
        const url = `people`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the Person!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchCreatePersonWithImages = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the Person!");
        const url = "people";
        const formData = new FormData();
        //Campos simples:
        Object.keys(data).forEach((key) => { if (key !== "images" && typeof data[key] !== "object") formData.append(key, data[key]); });
        //Objetos -> Stringify:
        formData.append("jobTitle", JSON.stringify(data.jobTitle));
        formData.append("address", JSON.stringify(data.address));
        formData.append("legalAddress", JSON.stringify(data.legalAddress));
        formData.append("aboutMe", JSON.stringify(data.aboutMe));
        formData.append("continents", data.continents._id);
        formData.append("countries", data.countries._id);
        formData.append("provinces", data.provinces._id);
        formData.append("cities", data.cities._id);
        //Archivos:
        if(data.images && data.images.length > 0) {
            data.images.forEach((img) => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await createDataWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't create the Person!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchGetAllPeoplePopulate = async () => {
    try {
        const url = "people";
        const populateFields = ["cities", "provinces", "countries", "continents"];
        const data = await getDataPopulate(url, populateFields);
        if (!data) throw new Error("Error in fecth get all people populate or no data Available!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllPeoplePaginatePopulate = async ({ page = 1, limit = 10, language, searchPerson, searchDNI, searchContinent, searchCountry, searchProvince, searchCity }) => {
    try {
        const url = "people";
        const data = await getDataPagintePopulate(url, { page, limit, language, searchPerson, searchDNI, searchContinent, searchCountry, searchProvince, searchCity });
        if(!data) throw new Error("Error in fetch get people paginate populate");
        return data;
    } catch (error) { throw error; }
};

export const fetchPersonByIdPopulate = async (id) => {
    try {
        const url = `people/${id}`;
        const populateFields = ["cities", "provinces", "countries", "continents"];
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error in fetch get person by Id and populate or no data available!");
        return data;
    } catch (error) { throw error; }
};

export const fetchUpdatePersonById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Person to update!");
        if(!data) throw new Error("Error: Missing the data to update the Person!");
        const url = `people/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't update te Person!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchUpdatePersonByIdWithImages = async (id, data) => {
    try {
        if(!id) throw new Error("Missing Person Id!");
        if(!data) throw new Error("Error: Missing data to updte the person!");
        const url = `people/${id}`;
        const formData = new FormData();
        //Campos simples:
        const simpleFields = ["firstName", "lastName", "dni", "cuil", "birthday", "phone"];
        simpleFields.forEach(key => { if (data[key] !== undefined) formData.append(key, data[key]); });
        //Campos complejos -> stringify:
        if(data.jobTitle) formData.append("jobTitle", JSON.stringify(data.jobTitle));
        if(data.address) formData.append("address", JSON.stringify(data.address));
        if(data.aboutMe) formData.append("aboutMe", JSON.stringify(data.aboutMe));
        if(data.continents) formData.append("continents", data.continents._id);
        if(data.countries) formData.append("countries", data.countries._id);
        if(data.provinces) formData.append("provinces", data.provinces._id);
        if(data.cities) formData.append("cities", data.cities._id);
        if(data.images && data.images.length > 0) {
            const existingImages = data.images.filter(img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
        };
        //Nuevas imagenes:
        if(data.images && data.images.length > 0) {
            data.images.forEach(img => { if (img.file instanceof File) formData.append("images", img.file); });
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the Person!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchDeletePersonById = async (id) => {
    try {
        const url = `people/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error in fetch delete person By Id");
        return data;
    } catch (error) { throw error; }
};