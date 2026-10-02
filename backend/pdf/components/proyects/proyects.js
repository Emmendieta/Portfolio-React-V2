import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";
import QRCode from "qrcode";

export async function ProyectsCurriculum({ proyects, language }) {
    try {
        if(!proyects) throw new Error("Error: Couldn't get the information of the proyects to generate the PDF!");
        if(proyects.length === 0) return "";
        const sortedProyects = [...proyects].sort( (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0) );
        //const sortedProyects = proyects.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];

        const generateQR = async (url) => {
            try {
                if(!url) return "";   
                return await QRCode.toDataURL(url, { width: 150 });
            } catch (error) {
                console.error("Error generating QR Code: ", error.message);
                throw error;
            }
        };

         const projectsHTML = await Promise.all(
            sortedProyects.map(async (proyect) => {
                const name = getLocalizedValue(proyect.name, language);
                const company = getLocalizedValue(proyect.company, language);
                const description = getLocalizedValue(proyect.description, language);
                const qrProyect = await generateQR(proyect.linkProyect);

                return `
                    <div class="pdfProyBodyCont">
                        <h2 class="pdfProyTitle">• ${name}</h2>
                        <h2 class="pdfProy">${company}</h2>
                        <p class="pdfProyP">${description}</p>
                    </div>
                    <div class="pdfProySubCont">
                        <h1 class="pdfProySubH1">${TEXT.CATEGORIES}:</h1>
                        ${proyect.categories?.map(cat => {
                            const catName = getLocalizedValue(cat.name, language);
                            return `
                                <div class="pdfProySubDiv">
                                    <h2 class="pdfProySubH2">- ${catName}</h2>
                                </div>
                            `;
                        }).join("") || ""}
                    </div>

                    <div class="pdfProySubCont">
                        <h1 class="pdfProySubH1">${TEXT.SKILLS}:</h1>
                        ${proyect.skills?.map(skill => {
                            const skillName = getLocalizedValue(skill.name, language);
                            return `
                                <div class="pdfProySubDiv">
                                    <h2 class="pdfProySubH2">- ${skillName}</h2>
                                </div>
                            `;
                        }).join("") || ""}
                    </div>
                    <div class="pdfProySubCont">
                        <h1 class="pdfProySubH1">${TEXT.RESPONSIBILITIES}:</h1>
                        ${proyect.responsibilities?.map(resp => {
                            const respName = getLocalizedValue(resp.name, language);
                            return `
                                <div class="pdfProySubDiv">
                                    <h2 class="pdfProySubH2">- ${respName}</h2>
                                </div>
                            `;
                        }).join("") || ""}
                    </div>
                    ${ qrProyect ? `
                                <div class="pdfProyQRCont">
                                    <img src="${qrProyect}" alt="QR Project - ${name}" />
                                    <p>${TEXT.VIEW_PROYECT}</p>
                                </div>
                            ` : ""
                    } `;
            })
        );

        const html = `
            <section id="pdfProyCont">
                <h1 id="pdfProyH1">${TEXT.PROYECTS}:</h1>
                ${projectsHTML.join("")}
            </section>
        `;


        /*const html = `
            <section id="pdfProyCont">
                <h1 id="pdfProyH1">${TEXT.PROYECTS}:</h1>
                ${sortedProyects.map(proyect => {
                    const name = getLocalizedValue(proyect.name, language);
                    const company = getLocalizedValue(proyect.company, language);
                    const description = getLocalizedValue(proyect.description, language);
                    const qrProyect = await generateQR(proyect.linkProyect);
                    return `
                        <div class="pdfProyBodyCont">
                            <h2 class="pdfProyTitle">• ${name}</h2>
                            <h2 class="pdfProy">${company}</h2>
                            <p class="pdfProyP">${description}</p>
                        </div>
                        <div class=""pdfProySubCont>
                            <h1 class="pdfProySubH1">${TEXT.CATEGORIES}:</h1>
                            ${proyect.categories?.map(cat => {
                                const catName = getLocalizedValue(cat.name, language);
                                return `
                                    <div class="pdfProySubDiv">
                                        <h2 class="pdfProySubH2">- ${catName}</h2>
                                    </div>
                                `
                            }).join("")}                        
                        </div>
                        <div class="pdfProySubCont">
                            <h1 class="pdfProySubH1">${TEXT.SKILLS}:</h1>
                            ${proyect.skills?.map(skill => {
                                const skillName = getLocalizedValue(skill.name, language);
                                return `
                                    <div class="pdfProySubDiv">
                                        <h2 class="pdfProySubH2">- ${skillName}</h2>
                                    </div>
                                `
                            }). join("")}
                        </div>
                        <div class="pdfProySubCont">
                            <h1 class="pdfProySubH1">${TEXT.RESPONSIBILITIES}:</h1>
                            ${proyect.responsibilities?.map(resp => {
                                const respName = getLocalizedValue(resp.name, language);
                                return `
                                    <div class="pdfProySubDiv">
                                        <h2 class="pdfProySubH2">- ${respName}</h2>
                                    </div>
                                `
                            }).join("")}
                        </div>
                        <div>
                            <img class="" src="${qrProyect}" alt="qrProyect - ${name}"/>
                            <p>${TEXT.VIEW_PROYECT}</p>
                        </div>
                    `;
                }).join("")}
            </section>
        `;*/

        return html;
    } catch (error) {
        throw error;
    }
};