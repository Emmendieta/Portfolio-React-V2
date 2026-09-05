import { createData, deleteData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateContinent = async (data) => {
    try {
        const url = `continents`;
        const dataResponse = await createData(url, data);
        if (!dataResponse) throw new Error("Error in fetch create Continent!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchContinentByIdPopulate = async (id) => {
    try {
        if (!id) throw new Error("Error: Couldn't get the Id of the Continent to update!");
        const populateFields = ["countries", "countries.provinces", "countries.provinces.cities"];
        const url = `continents/${id}`;
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error: Couldn't get the data of the Continent by Id populate!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllContinentsPopulate = async () => {
    try {
        const url = "continents";
        const populateFields = ["countries", "countries.provinces", "countries.provinces.cities"];
        const data = await getDataPopulate(url, populateFields);
        if (!data) throw new Error("Error in fetch get all Continents populate or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllContinentsPaginatePopulate = async ({ page = 1, limit = 10, language, searchName, searchCountry }) => {
    try {
        const url = "continents";
        const data = await getDataPagintePopulate(url, { page, limit, searchContinent: searchName, searchCountry, language });
        if(!data) throw new Error("Error fetching continents paginate populate");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateContinentById = async (id, data) => {
    try {
        const url = `continents/${id}`;
        const dataResponse = await updateDataById(url, data);
        if (!dataResponse) throw new Error("Error in fetch update Continent By Id or no data recibed!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteContinentById = async (id) => {
    try {
        const url = `continents/${id}`;
        const data = await deleteData(url);
        if (!data) throw new Error("Error in fetch delete Continent by Id or coudn't delete the Continent!");
        return data;
    } catch (error) {
        throw error;
    }
};