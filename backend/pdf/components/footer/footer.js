import { LANG_PDF } from "../../../utils/langPDF";
import QRCode from "qrcode";

export function FooterCurriculum({ user, language }) {
    try {
        if(!user) throw new Error("Error: Couldn't get the information of the person to generate the PDF!");
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];
        const url = "https://www.emmendieta.com";

        generateQR = async (url) => {
            try {
                if(!url) return "";
                return await QRCode.toDataURL(url, { width: 150 });
            } catch (error) {
                console.error("Error generating QR code: ", error.message);
                throw error;
            }
        };
        const qrCode = generateQR(url);
        const qrPhone = `https://wa.me/${user.people?.phone}`;

        const html = `
            <section>
                <div>
                    <img class="" src="${qrCode}" alt="qrPortfolio/>
                    <p>${VIEW_PROTFOLIO}</p>
                </div>
                <div>
                    <img class="" src="${qrPhone}" atl="qrPhone"/>
                    <p>${WHATSAPP}</p>
                </div>
            </section>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};