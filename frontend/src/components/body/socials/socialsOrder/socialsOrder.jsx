import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { fetchGetAllSocials, fetchUpdateSocialsOrder } from "../socialsLogic";
import Ols from "../../generalFields/Ols/Ols";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import "../../generalFields/generalReorder.css";

function SocialOrder() {
    const { user } = useContext(UserContext);
    const { errorSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                startLoading();
                const result = await fetchGetAllSocials();
                if(result?.error) {
                    setSkills([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const socials = result.response || [];
                setSocials(socials);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadSkills();
    }, [user, language]);

    const handleSaveOrder = async () => {
        try {
            setLoading(true);
            startLoading();
            const result = await fetchUpdateSocialsOrder(socials);
            if(result?.error) {
                console.error(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            };
            await successSweet(`${TEXT.SOCIALS} ${TEXT.UPDATE_SUCCESS}!`);
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="olReorderCont">
            <section className="olReorderSectTop">
                <Ols items={socials} setItems={setSocials} clOl="olReorderCont" clLi="olReorderLi"
                    clItemCont="olReorderLiCont" clButtons="olReorderButtonCont" clButtons="olReorderBtn"
                    renderItem={(social) => (
                    <div className="genReorderUlDiv">
                        <H2Fields value={social.order} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                        <H2Fields value={social.name} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                        <H2Fields value={social.typeSocial} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                    </div>
                )} />
            </section>
            <section className="genReorderSectBottom">
                <button type="button" className="btn btn-outline-success" onClick={handleSaveOrder}>{TEXT.UPDATE_ORDER}</button>
            </section>
        </div>
    );
};

export default SocialOrder;