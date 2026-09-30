import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";

export function SkillsCurriculum({ skills, language }) {
    try {
        if(!skills) throw new Error("Error: Couldn't get the information of the skills to generate the PDF!");
        if(skills.length === 0) return "";
        const hardSkills = skills.filter(skill => skill.type === "Hard") || [];
        const sortedHard = [...hardSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
        const softSkills = skills.filter(skill => skill.type === "Soft") || [];
        const sortedSoft = [...softSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

        const html = `
            <section>
                <div>
                    <h1>{TEXT.SKILLS}:</h1>
                        ${hardSkills.length > 0 ? `
                            <div>
                            <h2>{TEXT.HARD SKILLS}:</h2>
                            ${sortedHard.map(skill => {
                                const name = getLocalizedValue(skill.name, language);
                                return `
                                <div>
                                    <h2>• ${name}:</h2>
                                    <h2>${skill.percent}</h2>
                                </div>
                                `;
                            }).join("")}
                            </div>
                        `: ""
                        }
                        ${softSkills.length > 0 ? `
                            <div>
                                <h2>{TEXT.SOFT SKILLS}:</h2>
                                ${sortedSoft.map(skill => {
                                    const name = getLocalizedValue(skill.name, language);
                                    return `
                                        <div>
                                            <h2>• ${name}</h2>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                            `: ""
                        }
                </div>
            </section>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};