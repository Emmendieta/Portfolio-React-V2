import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";

export function aboutMeCurriculum({ aboutMe, language }) {
    try {
        if(!aboutMe) throw new Error("Error: Couldn't get the information of About me to generate the PDF!");
        const userAboutMe = getLocalizedValue(aboutMe, language);
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];

        const html = `
            <section id ="aboutMeCont">
                <h1 class="pdfAboutMeH1">${TEXT.ABOUT_ME}:</h1>
                <h2 class="pdfAboutMeH2">${userAboutMe}</h2>
            </section>
        `;
        return html;
    } catch (error) {
        throw error;
    }
};