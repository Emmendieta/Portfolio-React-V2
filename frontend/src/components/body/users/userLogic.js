import { createData, createDataWithImages, deleteData, getDataByIdPopulate, getDataPagintePopulate, getDataPopulate, updateDataById, updateDataByIdWithImages } from "../../../helpers/crud.helper";

export const fetchCreateUser = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the User!");
        const url = `users`;
        const dataResponse = await createData(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't create the User!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchCreateUserWithImages = async (data) => {
    try {
        if(!data) throw new Error("Error: Couldn't get the data to create the User!");
        const url = "users";
        const formData = new FormData();
        //User:
        if(data.user) {
            const simpleUserFields = ["user", "email", "password", "active"];
            simpleUserFields.forEach(key => { if(data.user[key] !== undefined) { formData.append(key, data.user[key]); }});
        };
        //Person:
        if(data.person) {
            const simplePersonFields = ["firstName", "lastName", "dni", "cuil", "birthday", "phone"];
            simplePersonFields.forEach(key => { if(data.person[key] !== undefined) { formData.append(key, data.person[key]); }});
        };
        //Objetos Complejos -> stringify:
        if(data.person.jobTitle) formData.append("jobTitle", JSON.stringify(data.person.jobTitle));
        if(data.person.address) formData.append("address", JSON.stringify(data.person.address));
        if(data.person.aboutMe) formData.append("aboutMe", JSON.stringify(data.person.aboutMe));
        if(data.person.legalAddress) formData.append("legalAddress", JSON.stringify(data.person.legalAddress));
        if(data.person.continents?._id) formData.append("continents", data.person.continents?._id);
        if(data.person.countries?._id) formData.append("countries", data.person.countries?._id);
        if(data.person.provinces?._id) formData.append("provinces", data.person.provinces?._id);
        if(data.person.cities?._id) formData.append("cities", data.person.cities?._id);
        //Images:
        if(data.person.images && data.person.images.length > 0) {
            data.person.images.forEach(img => { if(img.file instanceof File) { formData.append("images", img.file); }});
        };
        //Roles:
        if(data.roles && data.roles.length > 0) { 
            const rolesIds = data.roles.map(role => role._id);
            formData.append("roles", JSON.stringify(rolesIds));
        };
        //Extra Permission:
        if(data.extraPermission && data.extraPermission.length > 0){ 
            const extraPermissionsIds = data.extraPermission.map(perm => perm._id);
            formData.append("extraPermission", JSON.stringify(extraPermissionsIds));
        };
        const dataResponse = await createDataWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't create the User!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchUserByIdPopulate = async (id) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the User to populate!");
        const populateFields = ["people", "people.continents", "people.countries", "people.provinces", "people.cities", "roles", "roles.permissions", "extraPermission"];
        const url = `users/${id}`;
        const data = await getDataByIdPopulate(url, populateFields);
        if(!data) throw new Error("Error: Couldn't get the information of the User by Id populate!");
        return data;
    } catch (error) { throw error; }
};

export const fetchUsersPopulate = async () => {
    try {
        const url = "users";
        const populateFields = ["people", "people.continents", "people.countries", "people.provinces", "people.cities", "roles", "roles.permissions", "extraPermission"]; //FALTA CONTINENTS, COUNTRIES, PROVINCES CITIES
        const data = await getDataPopulate(url, populateFields);
        if(!data) throw new Error("Error in fetch get all users popualte or no data recibed!");
        return data;
    } catch (error) { throw error; }
};

export const fetchGellAllUsersPaginatePopulate = async ({ page = 1, limit = 10, language, searchUser, searchEmail, searchDNI, searchFullName }) => {
    try {
        const url = "users";
        const data = await getDataPagintePopulate(url, { page, limit, searchUser, searchEmail, searchDNI, searchPerson: searchFullName, language });
        if(!data) throw new Error("Error fetching users paginate populate");
        return data;
    } catch (error) { throw error; }
};

export const fetchUpdateUserById = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the User to update!");
        if(!data) throw new Error("Error: Couldn't get the data of the User to update!");
        const url = `users/${id}`;
        const dataResponse = await updateDataById(url, data);
        if(!dataResponse) throw new Error("Error: Couldn't update the User!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchUpdateUserByIdWithImages = async (id, data) => {
    try {
        if(!id) throw new Error("Error: Couldn't get the Id of the User to update!");
        if(!data) throw new Error("Error: Couldn't get the deta of the User to updte!");
        const url = `users/${id}`;
        const formData = new FormData();
        //USER:
        if(data.user) {
            const simpleUserFields = ["user", "email", "password", "active"];
            simpleUserFields.forEach(key => { if (data.user[key] !== undefined) { formData.append(key, data.user[key]); }});
        };
        //PERSON:
        if(data.person) {
            const simplePersonFields = ["firstName", "lastName", "dni", "cuil", "birthday", "phone"];
            simplePersonFields.forEach(key => { if(data.person[key] !== undefined) { formData.append(key, data.person[key]); }});
        };
        //Objetos complejos -> stringify
        if(data.person._id) formData.append("personId", data.person._id);
        if(data.person.jobTitle) formData.append("jobTitle", JSON.stringify(data.person.jobTitle));
        if(data.person.address) formData.append("address", JSON.stringify(data.person.address));
        if(data.person.aboutMe) formData.append("aboutMe", JSON.stringify(data.person.aboutMe));
        if(data.person.continents?._id) formData.append("continents", data.person.continents?._id);
        if(data.person.countries?._id) formData.append("countries", data.person.countries?._id);
        if(data.person.provinces?._id) formData.append("provinces", data.person.provinces?._id);
        if(data.person.cities?._id) formData.append("cities", data.person.cities?._id);
        //Images:
        if(data.person.images && data.person.images.length > 0) {
            //Imagenes existentes:
            const existingImages = data.person.images.filter (img => !img.file).map(img => ({ publicId: img.publicId, isMain: img.isMain }));
            formData.append("existingImages", JSON.stringify(existingImages));
            //Nuevas imagenes:
            data.person.images.forEach(img => { if(img.file instanceof File) { formData.append("images", img.file); }});
        };
        //Roles:
        if(data.roles && data.roles.length > 0) { 
            const rolesIds = data.roles.map(role => role._id);
            formData.append("roles", JSON.stringify(rolesIds));
        };
        //Extra Permission:
        if(data.extraPermission && data.extraPermission.length > 0) { 
            const extraPermissionsIds = data.extraPermission.map(perm => perm._id);
            formData.append("extraPermission", JSON.stringify(extraPermissionsIds));
        };
        const dataResponse = await updateDataByIdWithImages(url, formData);
        if(!dataResponse) throw new Error("Error: Couldn't update the User!");
        return dataResponse;
    } catch (error) { throw error; }
};

export const fetchDeleteUserById = async (id) => {
    try {
        const url = `users/${id}`;
        const data = await deleteData(url);
        if(!data) throw new Error("Error couldn't delete the user by Id!");
        return data;
    } catch (error) { throw error; }
};