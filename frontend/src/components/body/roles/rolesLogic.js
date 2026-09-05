import { createData, deleteData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById } from "../../../helpers/crud.helper.js";

export const fetchCreateRole = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the Role!");
        const url = `roles`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the Role!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchGetAllRolesPopulate = async () => {
    try {
        const url = "roles";
        const populateFields = ["permissions"];
        const data = await getDataPopulate(url, populateFields);
        if(!data) throw new Error ("Error in fetch get all roles populate or no data available!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGetAllRolesPaginatePopulate = async ({ page = 1, limit = 10, language, searchRole, searchPermission }) => {
    try {
        const url = "roles";
        const data = await getDataPagintePopulate(url, { page, limit, searchRole, searchPermission, language });
        if(!data) throw new Error("Error in fetch roles paginate populate");
        return data.response;
    } catch (error) { throw error; }
};

export const fetchRolePopulateById = async (id) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the Role to populate!");
        const populateFields = ["permissions"];
        const url = `roles/${id}`;
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error: Couldn't get the information of the Role By Id populate!");
        return data;
    } catch (error) { throw error; }
};

export const fetchUpdateRoleById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the Role to update!");
        if(!data) throw new Error("Error: Couldn't get the data of the Role to update!");
        const url = `roles/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't update the Role!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchDeleteRoleById = async (id) => {
    try {
        const url = `roles/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error couldn't delete the role by Id!");
        return data;
    } catch (error) { throw error; }
};