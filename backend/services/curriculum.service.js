import puppeteer from "puppeteer";
import { getLocalizedValue } from "../helpers/getValueLocalized.helper.js";
import { headerCurriculum } from "../pdf/components/header/header.js";
import { educationsCurriculum } from "../pdf/components/educations/educations.js";
import { worksCurriculum } from "../pdf/components/works/works.js";
import { SkillsCurriculum } from "../pdf/components/skills/skills.js";
import { ProyectsCurriculum } from "../pdf/components/proyects/proyects.js";
import fs from "fs/promises";
import path from "path";
import __dirname from "../utils/utils.js";
import { FooterCurriculum } from "../pdf/components/footer/footer.js";

class CurriculumService {
    constructor() {

    };
    generatePDF = async (data) => {
        try {
            const { user, educations, works, skills, proyects, language } = data;
            
            //Data:
            const headerHTML = headerCurriculum({ user, language });
            const educationsHTML = educationsCurriculum({ educations, language });
            const worksHTML = worksCurriculum({ works, language });
            const skillsHTML = SkillsCurriculum({ skills, language });
            const proyectsHTML = await ProyectsCurriculum({ proyects, language });
            const footerHTML = await FooterCurriculum({ user, language });

            //Styles:
            const htmlStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "curriculum.css"), "utf-8");
            const headerStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "components", "header", "header.css"), "utf-8");
            const worksStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "components", "works", "works.css"), "utf-8");
            const eduStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "components", "educations", "educations.css"), "utf-8");
            const skillsStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "components", "skills", "skills.css"), "utf-8");
            const proyectsStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "components", "proyects", "proyects.css"));
            const footerStyles = await fs.readFile(path.join(__dirname, "..", "pdf", "componentes", "footer", "footer.css"), "utf-8");
            
            
            const html = `
                <html>
                    <head>
                        <style>
                            ${htmlStyles}
                            ${headerStyles}
                            ${worksStyles}
                            ${eduStyles}
                            ${skillsStyles}
                            ${proyectsStyles}
                            ${footerStyles}
                        </style>
                    </head>
                    <body id="pdfBody">
                        <header id="pdfHeader">
                            ${headerHTML}
                        </header>
                        <main id="pdfMain">
                            ${worksHTML}
                            ${educationsHTML}
                            ${skillsHTML}
                            ${proyectsHTML}
                        </main>
                        <footer id="pdfFooter">
                            ${footerHTML}
                        </footer>
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