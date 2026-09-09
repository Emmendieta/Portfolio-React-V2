import { createData, deleteData, getData, getDataById, getDataPopulate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreateResponsibility = async (data) => {
    try {
        const url = "responsibilities";
        const dataResponse = await createData(url, data);
        if (!dataResponse) throw new Error("Error in fetch create Responsibility!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllResponsibilities = async () => {
    try {
        const url = "responsibilities";
        const data = await getData(url);
        if (!data) throw new Error("Error in fetch get all responsibilities or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetGetAllResponsibilitiesPaginate = async ({ page = 1, limit = 10, searchName = "", language = "es" }) => {
    try {
        const filter = {};
        if (searchName) filter[`name.${language}`] = { $regex: searchName, $options: "i" };
        const url = "responsibilities";
        const data = await getDataPopulate(url, { page, limit, filter, sort: { [`name.${language}`]: 1 } });
        if (!data) throw new Error("Error in fetch get all responsibilities paginate or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchResponsibilityById = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the responsibility");
        const url = `responsibilities/${id}`;
        const dataResponse = await getDataById(url);
        if (!dataResponse) throw new Error("Error in fetch get responsibility by Id or no data available!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdateResponsibilityById = async (id, data) => {
    try {
        if (!id) throw new Error("Error: Missing Id of the responsibility!");
        const url = `responsibilities/${id}`;
        const dataResponse = await updateDataById(url, data);
        if (!dataResponse) throw new Error("Error in fetch update responsibility by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeleteResponsibilityById = async (id) => {
    try {
        if (!id) throw new Error("Error: Missing the Id of the responsibility!");
        const url = `responsibilities/${id}`;
        const dataResponse = await deleteData(url);
        if (!dataResponse) throw new Error("Error in fetch delete responsibility by Id!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

