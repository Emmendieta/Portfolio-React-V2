import { useContext } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useEffect } from "react";
import { useState } from "react";
import { useLoading } from "../../../../context/Loading.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { fetchGetAllCategories, fetchUpdateCategoriesOrder } from "../categoriesLogic";
import Ols from "../../generalFields/Ols/Ols";
import "../../generalFields/generalReorder.css";

function CategoriesOrder() {
    const { user } = useContext(UserContext);
    const { errorSweet, successSweet } = useSweetAlert();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language] || LANG_CONST.es;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                console.log("TEXT", TEXT.TEXT_ERROR_OOPS)
                startLoading();
                const result = await fetchGetAllCategories();
                if(result?.error) {
                    setCategories([]);
                    const errorMsg = result?.error?.message || TEXT.TEXT_ERROR_OOPS;
                    return await errorSweet(`${TEXT.ERROR || "Error"}: ${errorMsg}`);
                };
                const categoriesRes = result.response || [];
                setCategories(categoriesRes);
            } catch (error) {
                setCategories([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCategories();
    }, [user, language]);

    const handleSaveOrder = async () => {
        try {
            setLoading(true);
            startLoading();
            const result = await fetchUpdateCategoriesOrder(categories);
            if(result?.error) {
                const errorMsg = result?.error?.message || TEXT.TEXT_ERROR_OOPS;
                console.error(`${TEXT.ERROR || "Error"}: ${errorMsg}`);
                return await errorSweet(`${TEXT.ERROR || "Error"}: ${errorMsg}`);
            };
            await successSweet(`${TEXT.CATEGORIES} ${TEXT.UPDATE_SUCCESS}!`);
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}`|| TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}`|| TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return(
        <div className="genReorderCont">
            <section className="genReorderSectTop">
                <Ols items={categories} setItems={setCategories} renderItem={(category) => (
                    <div className="genReorderUlDiv">
                        {category.order}
                        {category.name?.[language]}
                    </div>
                )} />
            </section>
            <section className="genReorderSectBottom">
                <button type="button" className="btn btn-outline-success" onClick={handleSaveOrder}>{TEXT.UPDATE_ORDER}</button>
            </section>
        </div>
    );
};

export default CategoriesOrder;