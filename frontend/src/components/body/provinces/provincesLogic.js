import { createData, deleteData, getData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateProvince = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the Province!");
        const url = `provinces`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the Province!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchGetAllProvincesUnassigned = async () => {
    try {
        const url = `provinces/all/filt/unassigned`;
        const data = await getData(url);
        if(!data) throw new Error("Error: Couldn't get all Provinces Unassigned!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllProvincesPopulate = async () => {
    try {
        const url = "provinces";
        const populateFields = ["cities"];
        const data = await getDataPopulate(url, populateFields);
        if(!data) throw new Error("Error in fetch get all Provinces Populate or no data available!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllProvincesPaginatePopulate = async( { page = 1, limit = 10, language, searchName, searchCity }) => {
    try {
        const url = "provinces";
        const data = await getDataPagintePopulate(url, {page, limit, searchProvince: searchName, searchCity, language });
        if(!data) throw new Error("Error fetching provinces paginate populate!");
        return data;
    } catch (error) { throw error; }
};

export const fethProvinceByIdPopulate = async (id) => {
    try {
        const url = `provinces/${id}`;
        const populateFields = ["cities"];
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error in fetch get Province By Id Populate or no data Available!");
        return data;
    } catch (error) { throw error; }
};

export const fetchUpdateProvinceById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the Province to update!");
        if(!data) throw new Error("Error: Couldn't get the data of the Province to update!");
        const url = `provinces/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Coulnd't update the Province!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchDeleteProvinceById = async (id) => {
    try {
        const url = `provinces/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error couldn't delete the province by id!");
        return data;
    } catch (error) { throw error; }
};