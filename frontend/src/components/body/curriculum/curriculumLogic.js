import { createData } from "../../../helpers/crud.helper";

export const fetchGeneratePDF = async (items) => {
    try {
        if(!items || items.length === 0) throw new Error("Error: You must select a item to generate the PDF!");
        const url = "curriculum/pdf";
        console.log("ANTES DE ENVIAR:", JSON.stringify(items, null, 2));
        const dataResponse = await createData(url, items);
        if(!dataResponse) throw new Error("Error: Couldn't create the PDF!");
        return dataResponse;
    } catch (error) { throw error; }
};