import { createData, deleteData, getData, getDataById, getDataPaginate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateCity = async (data) => {
    try {
        const url = `cities`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error in fetch create City!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllCitiesUnassigned = async () => {
    try {
        const url = `cities/all/filt/unassigned`;
        const data = await getData(url);
        if(!data) throw new Error("Error: Couldn't get all Cities Unassigned!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllCities = async () => {
    try {
        const url = "cities";
        const data = await getData(url);
        if(!data) throw new Error("Error in fetch get all Cities or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllCitiesPaginate = async ({ page = 1, limit = 10, searchName = "", searchZip = "", language = "es" }) => {
    try {
        const filter = {};
        if(searchName) filter[`name.${language}`] = { $regex: searchName, $options: "i" };
        if(searchZip) filter.zipCode = { $regex: searchZip, $options: "i" };
        const url = "cities";
        const data = await getDataPaginate(url, { page, limit, filter, sort: { [`name.${language}`]: 1 } });
        if(!data) throw new Error("Error in fetch get all Cities paginate or no data available!!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchCityById = async (id) => {
    try {
        const url = `cities/${id}`;
        const data = await getDataById(url);
        if(!data) throw new Error("Error in fetch get City By Id or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateCityById = async (id, data) => {
    try {
        const url = `cities/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error in fetch update City by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteCityById = async (id) => {
    try {
        const url = `cities/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error in fetch delete City by Id or couldn't delete the City!");
        return data;
    } catch (error) {
        throw error;
    }
};