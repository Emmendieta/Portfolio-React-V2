const baseHeaders = { "Content-Type": "application/json" };
const credentials = "include";
const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OPTS_CREATE = (data) => ({
    method: POST,
    headers: baseHeaders,
    credentials: credentials,
    body: JSON.stringify(data)
});

const OPTS_CREATE_MULTIPART = (data) => ({
    method: POST,
    credentials: credentials,
    body: data
});

const OPTS_GET = {
    method: GET,
    headers: baseHeaders,
    credentials: credentials
};

const OPTS_UPDATE = (data) => ({
    method: PUT,
    headers: baseHeaders,
    credentials: credentials,
    body: JSON.stringify(data)
});

const OPTS_UPDATE_MULTIPART = (data) => ({
    method: PUT,
    credentials: credentials,
    body: data
});

const OPTS_DELETE = {
    method: DELETE,
    headers: baseHeaders,
    credentials: credentials
};

export const createData = async (baseURL, data) => {
    try {
        if (!baseURL) throw new Error("Error in getting the URL to process the information!");
        if (!data) throw new Error("Error in getting the data to process the creation!");
        const url = `${BACKEND_URL}/${baseURL}`;
        const opts = OPTS_CREATE(data);
        const response = await fetch(url, opts);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error creating the information!");
        };
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) { throw error; }
};

export const createDataWithImages = async (baseURL, data) => {
    try {
        if (!baseURL) throw new Error("Error in getting the URL to process the information!");
        if (!data) throw new Error("Error in getting the data to process the creation!");
        const url = `${BACKEND_URL}/${baseURL}`;
        const opts = OPTS_CREATE_MULTIPART(data);
        const response = await fetch(url, opts);
        if (!response.ok) {
            const errorata = await response.json();
            throw new Error(errorata.error || "Error creating the information with images!");
        };
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) { throw error; }
};

export const getData = async (baseUrl) => {
    try {
        if (!baseUrl) throw new Error("Error getting the Url to process the information!");
        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error in getting the data!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    }
};

export const getDataByFilter = async (baseUrl, filters) => {
    try {
        if (!baseUrl) throw new Error("Error getting the Url to process the information");
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? `${BACKEND_URL}/${baseUrl}?${queryParams}` : `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error in getting the data!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    }
};

export const getDataPopulate = async (baseURL, populateFields) => {
    try {
        if (!baseURL) throw new Error("Error getting the Url to process the information!");
        if (!populateFields) throw new Error("Error recibing the Fields to populate the information!");
        let url = `${BACKEND_URL}/${baseURL}/all/populate`;
        if (Array.isArray(populateFields) && populateFields.length > 0) {
            url += "?" + populateFields.map(field => `populate=${field}`).join("&");
        } else if (typeof populateFields === "string") { url += `?populate=${populateFields}`; };
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error get data populate!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    };
};


export const getDataPopulateFilter = async (baseURL, populateFields, filters = {}) => {
    try {
        if (!baseURL) throw new Error("Error getting the Url to process the information!");
        if (!populateFields) throw new Error("Error recibing the Fields to populate the information!");
        let url = `${BACKEND_URL}/${baseURL}/all/populate`;
        const queryParams = [];
        //Populate:
        if (Array.isArray(populateFields) && populateFields.length > 0) {
            populateFields.forEach(field => {
                queryParams.push(`populate=${field}`);
            });
        } else if (typeof populateFields === "string") {
            queryParams.push(`populate=${populateFields}`);
        };
        //Filters:
        if (filters && filters.category) {
            queryParams.push(
                `category=${encodeURIComponent(filters.category)}`
            );
        }
        if(queryParams.length > 0) { url += `?${queryParams.join("&")}`};
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error get data populate!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    };
};

export const getDataPaginate = async (baseUrl, options) => {
    try {
        if (!baseUrl) throw new Error("Error getting the Url to process the information!");
        if (!options) throw new Error("Error recibing the Options to paginate the information!");
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);;
        if (options.filter) {
            for (const [key, value] of Object.entries(options.filter)) { params.append(`filter[${key}]`, JSON.stringify(value)); };
        };
        if (options.sort) {
            for (const [key, value] of Object.entries(options.sort)) { params.append(`sort[${key}]`, JSON.stringify(value)); };
        }
        let url = `${BACKEND_URL}/${baseUrl}/pag/paginate?${params.toString()}`;
        const response = await fetch(url, OPTS_GET);
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data?.message || "Request Error");
            error.status = response.status;
            throw error;
        };
        return data;
    } catch (error) { throw error; }
};

export const getDataPagintePopulate = async (baseURL, options) => {
    try {
        if (!baseURL) throw new Error("Error getting the Url!");
        if (!options) throw new Error("Error getting the paginate options!");
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page);
        if (options.limit) params.append("limit", options.limit);
        Object.entries(options).forEach(([key, value]) => {
            if (!["page", "limit", "filter", "sort", "populateFields"].includes(key) && value !== undefined && value !== "") {
                params.append(key, value);
            };
        });
        const url = `${BACKEND_URL}/${baseURL}/search/paginate?${params.toString()}`;
        const response = await fetch(url, OPTS_GET);
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data?.message || "Request Error!");
            error.status = response.status;
            throw error;
        };
        return data;
    } catch (error) { throw error; }
};

export const getDataById = async (baseUrl) => {
    try {
        if (!baseUrl) throw new Error("Error getting the Url to process the information!");
        let url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error get data by id!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    }
};

export const getDataByIdPopulate = async (baseUrl, populateFields) => {
    try {
        if (!baseUrl) throw new Error("Error getting the Url to process the information!");
        if (!populateFields) throw new Error("Error getting the field/s to populate the Data!");
        let url = `${BACKEND_URL}/${baseUrl}/populate`;
        if (Array.isArray(populateFields) && populateFields.length > 0) {
            url += "?" + populateFields.map(field => `populate=${field}`).join("&");
        } else if (typeof populateFields === "string") { url += `?populate=${populateFields}`; };
        const response = await fetch(url, OPTS_GET);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error get data by Id populate!");
        };
        const data = await response.json();
        return data;
    } catch (error) { throw error; }
};

export const updateDataById = async (baseUrl, data) => {
    try {
        if (!baseUrl) throw new Error("Error gettin the URL to process the information!");
        if (!data) throw new Error("Error getting the data to process the information!");
        const opts = OPTS_UPDATE(data);
        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, opts);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error update data by id!");
        };
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
};

export const updateDataByIdWithImages = async (baseURL, data) => {
    try {
        if (!baseURL) throw new Error("Error gettin the URL to process the information!");
        if (!data) throw new Error("Error getting the data to process the information!");
        const url = `${BACKEND_URL}/${baseURL}`;
        const opts = OPTS_UPDATE_MULTIPART(data);
        const response = await fetch(url, opts);
        if (!response.ok) {
            const errorata = await response.json();
            throw new Error(errorata.error || "Error updating vehicule!");
        };
        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) { throw error; }
};

export const bulkUpdateData = async (baseUrl, dataArray = []) => {
    try {
        if (!baseUrl) throw new Error("Error in getting the Url to process the reorder!");
        if (!Array.isArray(dataArray) || dataArray.length === 0) throw new Error("Error: No data was provided to update the order!");
        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, OPTS_UPDATE(dataArray));
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error in update the order!");
        };

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteData = async (baseUrl) => {
    try {
        if (!baseUrl) throw new Error("Error: In gettin the Url to process the information!");
        const url = `${BACKEND_URL}/${baseUrl}`;
        const response = await fetch(url, OPTS_DELETE);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error in deleting the data by Id!");
        };
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        throw error;
    }
};