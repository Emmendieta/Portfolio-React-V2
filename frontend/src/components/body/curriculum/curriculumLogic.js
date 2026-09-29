import { createCurriculum, createData } from "../../../helpers/crud.helper";

export const fetchGeneratePDF = async (items) => {
    try {
        if(!items || items.length === 0) throw new Error("Error: You must select a item to generate the PDF!");
        const url = "curriculum/pdf";
        const dataResponse = await createCurriculum(url, items);
        if(!dataResponse) throw new Error("Error: Couldn't create the PDF!");
        const blob = await dataResponse.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Curriculum-Mendieta-Emiliano-Manuel.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        return true;
        //return dataResponse;
    } catch (error) { throw error; }
};