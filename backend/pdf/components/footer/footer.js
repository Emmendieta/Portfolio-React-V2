import { LANG_PDF } from "../../../utils/langPDF.js";
import QRCode from "qrcode";

export async function FooterCurriculum({ user, language }) {
    try {
        if(!user) throw new Error("Error: Couldn't get the information of the person to generate the PDF!");
        const TEXT = LANG_PDF[language] || LANG_PDF["en"];
        const url = "https://www.emmendieta.com";

        const generateQR = async (url) => {
            try {
                if(!url) return "";
                return await QRCode.toDataURL(url, { width: 150 });
            } catch (error) {
                console.error("Error generating QR code: ", error.message);
                throw error;
            }
        };
        const phone = user.people?.phone;
        const whatsappUrl = phone ? `https://wa.me/${phone}`: "";
        const qrCode =  await generateQR(url);
        const qrPhone = await generateQR(whatsappUrl);

        const html = `
            <section class="pdfFooterBodyCont">
                <div class="pdfFooterQRCont">
                    <img class="" src="${qrCode}" alt="qrPortfolio"/>
                    <p>${TEXT.VIEW_PORTFOLIO}</p>
                </div>
                <div class="pdfFooterQRCont">
                    <img class="" src="${qrPhone}" alt  ="qrPhone"/>
                    <p>${TEXT.WHATSAPP}</p>
                </div>
            </section>
        `;

        return html;
    } catch (error) {
        throw error;
    }
};