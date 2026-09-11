export const parseBracketQuery = (query, prefix, parser = value => value) => {
    const result = {};
    for(const key in query) {
        if(key.startsWith(`${prefix}[`)) {
            const field = key.slice(prefix.length + 1, -1);
            result[field] = parser(query[key]);
        };
    };
    return result;
};

export const buildMatchStages = (filters, language = "es") => {
    const beforeLookup = [];
    const afterLookup = [];

    for(const [field, value] of Object.entries(filters)) {
        if(!value) continue;
        const match = { 
            $match: {
                [`${field}.${language}`]: {
                    $regex: value,
                    $options: "i"
                }
            }
        };
        if(field.includes(".")) { afterLookup.push(match); }
        else { beforeLookup.push(match); }        
    };
    return { beforeLookup, afterLookup };
};

export const buildMatchStagesGeneric = (filters, { language = "es", translatedFields = [], strignFields = [] } = {} ) => {
    const stages = [];
    for (const [field,value] of Object.entries(filters)) {
        if(value === undefined || value === null || value === "") continue;
        let mongoField = field;
        //Fields with diferents languages:
        if(translatedFields.includes(field)) { mongoField = `${field}.${language}`; };
        stages.push({
            $match: {
                [mongoField]: {
                    $regex: String(value),
                    $options: "i"
                }
            }
        });
    };
    return stages;
};

export const parsePopulateQuery = (populate) => {
    if (Array.isArray(populate)) { return populate.filter(Boolean); };
    if (typeof populate === "string" && populate.trim() !== "") {
        return populate.split("&").filter(Boolean);
    };
    return [];
};