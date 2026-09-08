import { useContext } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useState } from "react";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useEffect } from "react";
import { fetchGetAllEducations, fetchUpdateEducationsOrder } from "../educationsLogic";
import Ols from "../../generalFields/Ols/Ols";

function EducationsOrder() {
    const { user } = useContext(UserContext);
    const { errorSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const result = await fetchGetAllEducations();
                if(result?.error) {
                    setEducations([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const educations = result.response || [];
                setEducations(educations);
            } catch (error) {
                setEducations([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, [user, language]);

    const handleSaveOrder = async () => {
        try {
            setLoading(true);
            startLoading();
            const result = await fetchUpdateEducationsOrder(educations);
            if(result?.error) {
                console.error(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            };
            await successSweet(`${TEXT.EDUCATIONS} ${TEXT.UPDATE_SUCCESS}`);
        } catch (error) {
            console.error(`${TEXT.ERROR}; ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}; ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div>
            <section>
                <Ols items={educations} setItems={setEducations} renderItem={(education) => (
                    <div>
                        {education.order}
                        {education.institutionName?.[language]}
                        {education.title?.[language]}
                        {education.typeEducation}
                    </div>
                )} />
            </section>
            <section>
                <button type="button" className="btn btn-outline-success" onClick={handleSaveOrder}>{TEXT.UPDATE_ORDER}</button>
            </section>
        </div>
    );
};

export default EducationsOrder;