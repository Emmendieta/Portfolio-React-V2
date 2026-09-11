export const normalizeName = (value = "") => {
    return value.trim().toLowerCase().split(" ").filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export const normalizeLowerNoSpace = (value = "") => {
    return value.toLowerCase().replace(/\s+/g, "");
};

export const normalizeUpperNoSpace = (value = "") => {
    return value.toUpperCase().replace(/\s+/g, "");
};

export const normalizeNumber = (value) => {
    const number = Number(value);
    return isNaN(number) ? "": number;
};

//ESTOY POR EMPEZAR LA PARTE 2