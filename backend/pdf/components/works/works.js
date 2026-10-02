import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";

export function worksCurriculum({ works, language }) {
    try {
        if(!works) throw new Error("Error: Couldn't get the information of the works to generate the PDF!");
        if(works.length === 0) return "";
        const sortedWorks = works.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];

        const html = `
            <section id="pdfWorkCont">
                <h1 id="pdfWorkH1">${TEXT.WORKS}:</h1>
                    ${sortedWorks.map(work => {
                        const jobTitle = getLocalizedValue(work.jobTitle, language);
                        const company = getLocalizedValue(work.company, language);
                        return `
                            <div class="pdfWorkBodyCont">
                                <div class="pdfWorkInfoCont">
                                    <h2 class="pdfWorkBodyH2Title">• ${jobTitle}</h2>
                                    <h2 class="pdfWorkBodyH2">${company}</h2>
                                    <h2 class="pdfWorkBodyH2">${formatDate(work.dateStart)} - ${work.dateEnd ? formatDate(work.dateEnd) : `${TEXT.CURRENT}`}</h2>
                                </div>
                                <div class="pdfWorkRespCont">
                                    <h1 id="pdfWorkRespH1">${TEXT.RESPONSIBILITIES}:</h1>
                                    <div class="pdfWorkRespH2Cont">
                                        ${work.responsibilities?.map(respon => {
                                            const responName = getLocalizedValue(respon.name, language);
                                            return `
                                                <h2 class="pdfWorkRespH2">- ${responName}</h2>
                                            `
                                        }).join("")}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join("")}
            </section>
        `;
        
        return html;
    } catch (error) {
        throw error;
    }
};