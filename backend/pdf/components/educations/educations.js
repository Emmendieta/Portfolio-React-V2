import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";

export function educationsCurriculum ({ educations, language }) {
    try {
        if(!educations) throw new Error("Error: Couldn't get the information of the educations to generate the PDF!");
        if(educations.length === 0) return "";
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];
        const educationsTypes = ["University", "Course", "High School", "Primary School", "Conference", "Other"];
        const groupedEducations = educationsTypes.reduce((gropus, type) => {
            gropus[type] = educations.filter(education => education.typeEducation === type).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
            return gropus;
        }, {});
        const html = `
            <section id="pdfEduCont">
                <h1 id="pdfEduH1">${TEXT.ACADEMIC_BACKGROUND}:</h1>
                <div class="pdfEduDivCont">
                    ${educationsTypes.map(type => {
                        const typeEducations = groupedEducations[type];
                        if(!typeEducations.length) { return ""; }
                        return `
                            <div class="pdfEduTitleCont">
                                <h1 class="pdfEduTitleH1">${TEXT.EDUCATION_LABELS?.[type]?.[language] || type}</h1> 
                            </div>
                            ${typeEducations.map(education => {
                                const institutionName = getLocalizedValue(education.institutionName, language);
                                const title = getLocalizedValue(education.title, language);
                                return `
                                    <div class="pdfEduBodyCont">
                                        <h2 class="pdfEduH2Title">• ${title}</h2>
                                        <h2 class="pdfEduH2">${institutionName}</h2>
                                        <h2 class="pdfEduH2">${formatDate(education.dateStart)} - ${education.dateEnd ? formatDate(education.dateEnd): `${TEXT.ONGOING}`}</h2>
                                    </div>
                                    <div class="pdfEduHabCont">
                                        <h1 class="pdfEduHabH1">${TEXT.HABILITIES}:</h1>
                                        <div class="pdfEduHabDivCont">
                                            ${education.habilities?.map(hab => {
                                                const habName = getLocalizedValue(hab.name, language);
                                                return `
                                                    <h2 class="pdfEduHabH2">- ${habName}</h2>
                                                `
                                            }).join("")}
                                        </div>
                                    </div>
                                `;
                            }).join("")}
                        `
                    }).join("")}
                </div>
            </section>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};