import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";

export function worksCurriculum({ works, language }) {
    try {
        if(!works) throw new Error("Error: Couldn't get the information of the works to generate the PDF!");
        if(works.length === 0) return "";
        const sortedWorks = works.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

        const html = `
            <section>
                <h1>{TEXT.WORKS}:</h1>
                <div>
                    ${sortedWorks.map(work => {
                        const jobTitle = getLocalizedValue(work.jobTitle, language);
                        const company = getLocalizedValue(work.company, language);
                        return `
                            <h2>• ${jobTitle}</h2>
                            <h2>${company}</h2>
                            <h2>${formatDate(work.dateStart)} - ${work.dateEnd ? formatDate(work.dateEnd) : "CONTINUA"}</h2>
                            //FALTAN LAS RESPONSIBILITIES 
                        `;
                    }).join("")}
                </div>
            </section>
        `;
        
        return html;
    } catch (error) {
        throw error;
    }
};