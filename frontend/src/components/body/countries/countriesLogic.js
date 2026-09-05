import { createData, deleteData, getData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateCountry = async (data) => {
    try {
        const url = "countries";
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the Country!");
        return data;
    } catch (error) { throw error; }
};

export const fetchCountryByIdPopulate = async (id) => {
    try {
        const url = `countries/${id}`;
        const populateFields = ["provinces", "provinces.cities"];
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error: Couldn't get the Country by Id populate!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllCountries = async () => {
    try {
        const url = `countries`;
        const data = await getData(url);
        if(!data) throw new Error("Error: Couldn't get All Countries!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllCountriesUnassigned = async () => {
    try {
        const url = `countries/all/filt/unassigned`;
        const data = await getData(url);
        if(!data) throw new Error("Error: Couldn't get All Countries Unassigned!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllCountriesPopulate = async () => {
    try {
        const url = `countries`;
        const populateFields = ["provinces", "provinces.cities"];
        const data = await getDataPopulate(url, populateFields);
        if(!data) throw new Error("Error: Couldn't get all Countries populate!");
        return data
    } catch (error) { throw error; }
};

export const fetchGetAllCountriesPaginatePopulate = async ({ page = 1, limit = 10, language, searchName, searchProvince }) => {
    try {
        const url = `countries`;
        const data = await getDataPagintePopulate(url, { page, limit, searchCountry: searchName, searchProvince, language });
        if(!data) throw new Error("Error fetching continents paginate populate!");
        return data;
    } catch (error) { throw error; }
};

export const fetchUpdateCountryById = async (id, data) => {
    try {
        const url =`countries/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't update the Country!");
        return data;
    } catch (error) { throw error; }
};

export const fetchDeleteCountryById = async (id) => {
    try {
        const url = `countries/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error: Couldn't delete the Country!");
        return data;
    } catch (error) { throw error; }
};