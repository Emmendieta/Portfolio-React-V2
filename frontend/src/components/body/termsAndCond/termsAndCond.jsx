import { useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "../../../helpers/Cookies.helper";
import { useLanguage } from "../../../context/Language.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../context/SweetAlert2.Context";
import { UserContext } from "../../../context/User.Context";
import "./termsAndCond.css";

function TermsAndCond({ children }) {
    const [hasAccepted, sethasAccepted] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, termsSweet } = useSweetAlert();

    useEffect(() => {
        const checkTerms = async() => {
            const termsAccepted = getCookie('PortfolioEMMTerms');
            if(termsAccepted === "accepted") {
                sethasAccepted(true);
                setIsChecking(false);
                return;
            };
            /*style="text-align: left; max-height: 300px; overflow-y: auto; padding-left: 8px;"*/
            const result = await termsSweet({
                title: TEXT.TERM_COND,
                html: `
                    <div class="termsCondH2Cont">
                        <h2 class="termsCondH2Cont">
                            <a href="/terms" target="_blank" rel="noopener noreferrer" class="termsCondLink">
                                ${TEXT.VIEW_TERM_COND}
                            </a>
                        </h2>
                        <h1 class="termsCondH1">${TEXT.PRIVACY_2}</h1>
                        <h2 class="termsCondH2Cont">
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" class="termsCondLink">
                                ${TEXT.VIEW_PRIVACY_COND}
                            </a>
                        </h2>
                        <p class="termsCondP">${TEXT.ACCEPT_COND}</p>
                    </div>
                `,
                confirmButtonText: TEXT.ACCEPT,
                denyButtonText: TEXT.REJECT
            });
            if(result.isConfirmed) {
                setCookie("PortfolioEMMTerms", "accepted");
                sethasAccepted(true);
            };
            if(result.isDenied) {
                deleteCookie("PortfolioEMMLang");
                await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_TERM_COND}`);
                // Opción B: Redirigir fuera o recargar la página si los términos son obligatorios
                // window.location.href = "https://google.com";
                window.location.reload();
            };
            setIsChecking(false);
        };
        checkTerms();
    }, []);

    if(isChecking || !hasAccepted) return null;

    return children;
};

export default TermsAndCond;