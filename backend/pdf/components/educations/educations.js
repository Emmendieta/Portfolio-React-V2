import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";

export function educationsCurriculum ({ educations, language }) {
    try {
        if(!educations) throw new Error("Error: Couldn't get the information of the educations to generate the PDF!");
        if(educations.length === 0) return "";
        const educationsTypes = ["University", "Course", "High School", "Primary School", "Conference", "Other"];
        const groupedEducations = educationsTypes.reduce((gropus, type) => {
            gropus[type] = educations.filter(education => education.typeEducation === type).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
            return gropus;
        }, {});
        const html = `
            <section>
                <h1>{TEXT.ACADEMIC BACKGROUND}:</h1>
                <div>
                    ${educationsTypes.map(type => {
                        const typeEducations = groupedEducations[type];
                        if(!typeEducations.length) { return ""; }
                        return `
                            <div>
                                <h1>${type} VER DE CAMBIAR PARA QUE TENGA EL LENGUAGE<h1> 
                            </div>
                            ${typeEducations.map(education => {
                                const institutionName = getLocalizedValue(education.institutionName, language);
                                const title = getLocalizedValue(education.title, language);
                                return `
                                    <h2>${title}</h2>
                                    <h2>${institutionName}</h2>
                                    <h2>${formatDate(education.dateStart)} - ${formatDate(education.dateEnd)}</h2>
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