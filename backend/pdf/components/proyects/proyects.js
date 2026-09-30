import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";

export function ProyectsCurriculum({ proyects, language }) {
    try {
        if(!proyects) throw new Error("Error: Couldn't get the information of the proyects to generate the PDF!");
        if(proyects.length === 0) return "";
        const sortedProyects = proyects.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

        const html = `
            <section>
                <h1>{TEXT.PROYECTS}:</h1>
                ${sortedProyects.map(proyect => {
                    const name = getLocalizedValue(proyect.name, language);
                    const company = getLocalizedValue(proyect.company, language);
                    const description = getLocalizedValue(proyect.description, language);
                    return `
                        <div>
                            <h2>• ${name}</h2>
                            <h2>${company}</h2>
                            <p>${description}</p>
                            //FALTAN LAS CATEGORIES
                            //FALTAN LAS SKILLS
                            //FALTAN LAS RESPONSABILITIES
                            //FALTA GENERAR EL QR
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