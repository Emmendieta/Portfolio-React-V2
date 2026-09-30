export const formatDate = (date) => {
    if(!date) return;
    const parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())) return "";
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = parsedDate.getUTCFullYear();
    return `${day}-${month}-${year}`;
};