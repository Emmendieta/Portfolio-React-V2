export const getLocalizedValue = (value, language) => {
    if (!value) return "";
    if (value instanceof Map) {
        return value.get(language) ?? value.get(es) ?? "";
    };
    return value?.[language] ?? value.es ?? "";
};