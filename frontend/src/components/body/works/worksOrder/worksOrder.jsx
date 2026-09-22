import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { fetchGetAllWorks, fetchUpdateWorksOrder } from "../worksLogis";
import Ols from "../../generalFields/Ols/Ols";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import "../../generalFields/generalReorder.css";

function WorksOrder() {
    const { user } = useContext(UserContext);
    const { errorSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [works, setWorks] = useState([]);

    useEffect(() => {
        const loadWorks = async () => {
            try {
                startLoading();
                const result = await fetchGetAllWorks();
                if(result?.error){
                    setWorks([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const works = result.response || [];
                setWorks(works);
            } catch (error) {
                setWorks([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWorks();
    }, [user, language]);

    const handleSaveOrder = async () => {
        try {
            setLoading(true);
            startLoading();
            const result = await fetchUpdateWorksOrder(works);
            if(result?.error) {
                console.error(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            };
            await successSweet(`${TEXT.WORKS} ${TEXT.UPDATE_SUCCESS}!`);
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="genReorderCont">
            <section className="genReorderSectTop">
                <Ols items={works} setItems={setWorks} clOl="olReorderCont" clLi="olReorderLi"
                    clItemCont="olReorderLiCont" clButtons="olReorderButtonCont" clButtons="olReorderBtn"
                    renderItem={(work) => (
                    <div className="genReorderUlDiv">
                        <H2Fields value={work.order} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                        <H2Fields value={work.jobTitle?.[language]} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                        <H2Fields value={work.company?.[language]} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                    </div>
                )}/>
            </section>
            <section className="genReorderSectBottom">
                <button type="button" className="btn btn-outline-success" onClick={handleSaveOrder}>{TEXT.UPDATE_ORDER}</button>
            </section>
        </div>
    );
};

export default WorksOrder;