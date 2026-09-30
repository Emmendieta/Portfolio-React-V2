import { getLocalizedValue } from "../../../helpers/getValueLocalized.helper";

export function headerCurriculum({ user, language }) {
    try {
        if (!user) throw new Error("Error: Couldn't the information of the person to generate the PDF!");

        const userAboutMe = getLocalizedValue(user.people?.aboutMe, language);
        const userJobTitle = getLocalizedValue(user.people?.userJobTitle, language);
        const userCityName = getLocalizedValue(user.people?.cities[0]?.name, language);
        const userProvinceName = getLocalizedValue(user.people.provinces[0]?.name, language);
        const userCountryName = getLocalizedValue(user.people?.countries[0]?.name, language);

        const html = `
            <div>
                <h1>${user.people?.lastName} ${user.people?.firstName}</h1>
                <h2>${userJobTitle}</h2>
            </div>
            <div>
                <img src=${user.people?.images?.[0]?.url} alt=${user.people?._id ?? "Id"}/>
            </div>
            <div>
                <div>
                    <h2>{PERSONAL ADDDRESS}: ${user.people?.address?.street} - ${user.people?.address?.number} - ${userCityName} - ${userProvinceName} - ${userCountryName}</h2>
                </div>
                <div>
                    <h2>{LEGAL ADDRESS}: ${user.people?.legalAddress?.street} - ${user.people?.legalAddress?.number} - ${userCityName} - ${userProvinceName} ${userCountryName}</h2>
                </div>
                <div>
                    <h2>{BIRTHDAY}: ${user.people?.bithday} CAMBIAR EL FORMATO </h2>
                </div>
                <div>
                    <h2>{EMAIL}: ${user.email}</h2>
                </div>
            </div>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};