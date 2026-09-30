import { formatDate } from "../../../helpers/formatDate.helper.js";
import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper.js";

export function headerCurriculum({ user, language }) {
    try {
        if (!user) throw new Error("Error: Couldn't get the information of the person to generate the PDF!");
        const userAboutMe = getLocalizedValue(user.people?.aboutMe, language);
        const userJobTitle = getLocalizedValue(user.people?.jobTitle, language);
        const userCityName = getLocalizedValue(user.people?.cities?.name, language);
        const userProvinceName = getLocalizedValue(user.people.provinces?.name, language);
        const userCountryName = getLocalizedValue(user.people?.countries?.name, language);

        const html = `
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
                        <h2 class="pdfHeaderRightH2label">{PERSONAL ADDDRESS}:</h2>
                        <h2 class="pdfHeaderRightH2">${user.people?.address?.street} - ${user.people?.address?.number} - ${userCityName} - ${userProvinceName} - ${userCountryName}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">{LEGAL ADDRESS}:</h2>
                        <h2 class="pdfHeaderRightH2"> ${user.people?.legalAddress?.street} - ${user.people?.legalAddress?.number} - ${userCityName} - ${userProvinceName} ${userCountryName}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">{BIRTHDAY}:</h2>
                        <h2 class="pdfHeaderRightH2">${formatDate(user.people?.birthday)}</h2>
                    </div>
                    <div class="pdfHeaderRightDivCont">
                        <h2 class="pdfHeaderRightH2label">{EMAIL}:</h2>
                        <h2 class="pdfHeaderRightH2">${user.email}</h2>
                    </div>
                </div>
            </div>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};