export const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const newObj = { ...obj };
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
        };
        current[key] = { ...current[key] };
        current = current[key];
    };
    current[keys[keys.length - 1]] = value;
    return newObj;
};

export const hasErrors = (obj) => {
    if(!obj) return false;
    return Object.values(obj).some(value => {
        //Simple Error:
        if(typeof value === "string" && value) return true;
        //Anidate Error:
        if(typeof value === "object" && value !== null) return (Object.keys(value).length > 0 && hasErrors(value));
        return false;
    });
};