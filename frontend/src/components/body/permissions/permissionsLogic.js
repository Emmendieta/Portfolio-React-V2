import { createData, deleteData, getData, getDataById, getDataPaginate, updateDataById } from "../../../helpers/crud.helper";

export const fetchCreatePermission = async (data) => {
    try {
        if(!data) throw new Error("Error: Missing the data to create the Person!");
        const url = `permissions`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the Person!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllPermissions = async () => {
    try {
        const url = "permissions";
        const data = await getData(url);
        if(!data) throw new Error("Error in fetch get all permission or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchGetAllPermissionsPaginate = async ({ page = 1, limit = 10, searchName = "", searchKey = "", language = "es" }) => {
    try {
        const filter = {};
        if(searchName) filter[`name.${language}`] = { $regex: searchName, $options: "i" };
        if(searchKey) filter[`key`] = { $regex: searchKey, $options: "i" };
        const url = "permissions";
        const data = await getDataPaginate(url, {page, limit, filter, sort: { [`name.${language}`]: 1 }});
        if(!data) throw new Error("Error in fetch get all Permissions paginate or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchPermissionById = async (id) => {
    try {
        const url = `permissions/${id}`;
        const data = await getDataById(url);
        if(!data) throw new Error("Error in feth get permission by id or no data available!");
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchUpdatePermissionById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Missing the Id of the Permission to update!");
        if(!data) throw new Error("Error: Missing th data of the Permission to update!");
        const url = `permissions/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't update the Permission!");
        return dataResponse;
    } catch (error) {
        throw error;
    }
};

export const fetchDeletePermissionById = async (id) => {
    try {
        const url = `permissions/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error in fetch delete the permission by id!");
        return data;
    } catch (error) {
        throw error;
    }
};