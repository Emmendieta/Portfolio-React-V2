import puppeteer from "puppeteer";
import { getLocalizedValue } from "../helpers/getValueLocalized.helper.js";

class CurriculumService {
    constructor() {

    };
    generatePDF = async (data) => {
        try {
            const { user, educations, works, skills, proyects, language } = data;
            console.log("SERVICE Curriculum data", language);

            const userAboutMe = getLocalizedValue(user.people.aboutMe, language);
            const html = `
                <html>
                    <head>
                        <style>
                            //ACA VAN LAS IMPORTACIONES DE LOS STYLES
                        </style>
                    </head>
                    <body>
                        <div>
                            <header>
                                //ACA VA EL HEADER
                                <div>${userAboutMe}</div>
                            </header>
                        </div>
                    </body>
            `;

            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', "--disable-setuid-sandbox"]});
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { bottom: "30px" } });
            await browser.close();
            return pdfBuffer;
        } catch (error) {
            console.error("PDF Error:", error.message);
            throw new Error(`Error generating PDF: ${error.message}`);
        }
    };
};

const curriculumService = new CurriculumService();

export default curriculumService;