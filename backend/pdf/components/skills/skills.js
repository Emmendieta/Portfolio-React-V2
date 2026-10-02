import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";

export function SkillsCurriculum({ skills, language }) {
    try {
        if(!skills) throw new Error("Error: Couldn't get the information of the skills to generate the PDF!");
        if(skills.length === 0) return "";
        const hardSkills = skills.filter(skill => skill.type === "Hard") || [];
        const sortedHard = [...hardSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        const softSkills = skills.filter(skill => skill.type === "Soft") || [];
        const sortedSoft = [...softSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];

        const html = `
            <section id="pdfSkillCont">
                    <h1 id="pdfSkillsH1">${TEXT.SKILLS}:</h1>
                        ${hardSkills.length > 0 ? `
                            <div class="pdfSkillsSubCont">
                            <h2 class="pdfSkillsSubH2">${TEXT.HARD_SKILLS}:</h2>
                            ${sortedHard.map(skill => {
                                const name = getLocalizedValue(skill.name, language);
                                return `
                                <div class="pdfSkillsHardCont">
                                    <h2 class="pdfSkillsHardH2Title">• ${name}:</h2>
                                    <h2 class="pdfSkillsHardH2">${skill.percent}</h2>
                                </div>
                                `;
                            }).join("")}
                            </div>
                        `: ""
                        }
                        ${softSkills.length > 0 ? `
                            <div class="pdfSkillsSubCont">
                            <h2 class="pdfSkillsSubH2">${TEXT.SOFT_SKILLS}:</h2>
                                ${sortedSoft.map(skill => {
                                    const name = getLocalizedValue(skill.name, language);
                                    return `
                                        <div class="pdfSkillsSofCont">
                                            <h2 class="pdfSkillsHardH2Title">• ${name}</h2>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                            `: ""
                        }
            </section>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};