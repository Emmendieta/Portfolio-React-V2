import { createData, deleteData, getData, getDataById, getDataPaginate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateHability = async (data) => {
    try {
        const url = "habilities";
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error in fetch create Hability!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllHabilities = async () => {
    try {
        const url = 'habilities';
        const data = await getData(url);
        if(!data) throw new Error("Error in fetch get all habilities or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllHabilitiesPaginate = async ({ page = 1, limit = 10, searchName = "", language = "es"}) => {
    try {
        const filter = {};
        if(searchName) filter[`name.${language}`] = { $regex: searchName, $options: "i" };
        const url = 'habilities';
        const data = await getDataPaginate(url, { page, limit, filter, sort: { [`name.${language}`]: 1 } });
        console.log("LOGIC ", data)
        if(!data) throw new Error("Error in fetch get all habilities paginate or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchHabilityById = async (id) => {
    try {
        if(!id) throw new Error("Error: Missing the Id to fetch!");
        const url = `habilities/${id}`;
        const dataResponse = await getDataById(url);
        if(!dataResponse) throw new Error("Error in fetch get hability by Id or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateHabilityById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id to fetch!");
        const url = `habilities/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error in fetch update hability by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteHabilityById = async (id) => {
    try {
        const url = `habilities/${id}`;
        const dataResponse = await deleteData(url);
        if(!dataResponse) throw new Error("Error in fetch delete habilitiy by Id!");
        return dataResponse;
    } catch (error) {
        throw error
    }
};