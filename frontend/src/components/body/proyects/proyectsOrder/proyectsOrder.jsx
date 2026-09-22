import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { fetchGetAllProyects, fetchUpdateProyecsOrder } from "../proyectsLogic";
import Ols from "../../generalFields/Ols/Ols";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import "../../generalFields/generalReorder.css";

function ProyectsOrder() {
    const { user } = useContext(UserContext);
    const { errorSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(false);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [proyects, setProyects] = useState([]);

    useEffect(() => {
        const loadProyects = async () => {
            try {
                startLoading();
                const result = await fetchGetAllProyects();
                if(result?.error) {
                    setProyects([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const proyects = result.response || [];
                setProyects(proyects);
            } catch (error) {
                setProyects([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProyects();
    }, [user, language]);

    const handleSaveOrder = async () => {
        try {
            setLoading(true);
            startLoading();
            const result = await fetchUpdateProyecsOrder(proyects);
            if(result?.error) {
                console.error(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            };
            await successSweet(`${TEXT.PROYECTS} ${TEXT.UPDATE_SUCCESS}!`);
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
                <Ols items={proyects} setItems={setProyects} clOl="olReorderCont" clLi="olReorderLi"
                    clItemCont="olReorderLiCont" clButtons="olReorderButtonCont" clButtons="olReorderBtn"
                    renderItem={(proyect) => (
                    <div className="genReorderUlDiv">
                        <H2Fields value={proyect.order} language={language}
                            className="olReroderH2" classNameH2="olReorderH2Text"/>
                        <H2Fields value={proyect.name?.[language]} language={language}
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

export default ProyectsOrder;