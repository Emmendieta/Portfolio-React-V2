import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";
import { LANG_PDF } from "../../../utils/langPDF.js";

export function headerCurriculum({ user, language, personalInfo = {} }) {
    try {
        if (!user) throw new Error("Error: Couldn't get the information of the person to generate the PDF!");
        const people = user.people;
        const userAboutMe = getLocalizedValue(user.people?.aboutMe, language);
        const userJobTitle = getLocalizedValue(user.people?.jobTitle, language);
        const userCityName = getLocalizedValue(user.people?.cities?.name, language);
        const userProvinceName = getLocalizedValue(user.people.provinces?.name, language);
        const userCountryName = getLocalizedValue(user.people?.countries?.name, language);
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];

        //Helper to rtender only the fields selected:
        const renderField = (condition, label, value) => {
            if(!condition || value === undefined || value === null || value === "") return "";
            return `
                <div class="pdfHeaderRightDivCont">
                    <h2 class="pdfHeaderRightH2label">${label}:</h2>
                    <h2 class="pdfHeaderRightH2">${value}</h2>
                </div>
            `;
        };

        //Address:
        const personalAddress = [ 
            personalInfo.personalStreet ? people?.address?.street : null,
            personalInfo.personalNumber ? people?.address?.number : null,
            personalInfo.personalCity ? userCityName : null,
            personalInfo.personalProvince ? userProvinceName : null,
            personalInfo.personalCountry ? userCountryName : null
        ].filter(Boolean).join(" - ");

        const legalAddress = [
            personalInfo.legalStreet ? people?.legalAddress?.street : null,
            personalInfo.legalNumber ? people?.legalAddress?.number : null,
            personalInfo.legalCity ? userCityName : null,
            personalInfo.legalProvince ? userProvinceName : null,
            personalInfo.legalCountry ? userCountryName : null
        ].filter(Boolean).join(" - ");

        // Personal Info:
        const personalInfoHTML = `
            ${renderField(Boolean(personalAddress), TEXT.PERSONAL_ADDRESS, personalAddress) }
            ${renderField(Boolean(legalAddress), TEXT.LEGAL_ADDRESS, legalAddress) }
            ${renderField(personalInfo.birthday, TEXT.BIRTHDAY, formatDate(people?.birthday))}
            ${renderField(personalInfo.email, TEXT.EMAIL, user.email)}
        `;
        
        const html = `
            <div class="pdfHeaderCont">
                <div class="pdfHeaderLeft">
                    <h1 class="pdfHeaderLeftH1">${user.people?.lastName ?? ""} ${user.people?.firstName ?? ""}</h1>
                    <h2 class="pdfHeaderLeftH2">${userJobTitle ?? ""}</h2>
                </div>
                <div class="pdfHeaderMiddle">
                    <img src=${user.people?.images?.[0]?.url} alt=${user.people?._id ?? "Id"} class="pdfHeaderImg"/>
                </div>
                <div class="pdfHeaderRigth">
                    ${personalInfoHTML}
                </div>
            </div>
        `;

        /*const html = `
            <div class="pdfHeaderCont">
                <div class="pdfHeaderLeft">
                    <h1 class="pdfHeaderLeftH1">${user.people?.lastName} ${user.people?.firstName}</h1>
                    <h2 class="pdfHeaderLeftH2">${userJobTitle}</h2>
                </div>
                <div class="pdfHeaderMiddle">
                    <img src=${user.people?.images?.[0]?.url} alt=${user.people?._id ?? "Id"} class="pdfHeaderImg"/>
                </div>
                <div class="pdfHeaderRigth">
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">${TEXT.PERSONAL_ADDRESS}:</h2>
                        <h2 class="pdfHeaderRightH2">${user.people?.address?.street} - ${user.people?.address?.number} - ${userCityName} - ${userProvinceName} - ${userCountryName}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">${TEXT.LEGAL_ADDRESS}:</h2>
                        <h2 class="pdfHeaderRightH2"> ${user.people?.legalAddress?.street} - ${user.people?.legalAddress?.number} - ${userCityName} - ${userProvinceName} - ${userCountryName}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">${TEXT.BIRTHDAY}:</h2>
                        <h2 class="pdfHeaderRightH2">${formatDate(user.people?.birthday)}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">${TEXT.EMAIL}:</h2>
                        <h2 class="pdfHeaderRightH2">${user.email}</h2>
                    </div>
                </div>
            </div>
        `;*/

        return html;
    } catch (error) {
        throw error;
    }
};