import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useNavigate, useParams } from "react-router-dom";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCityById, fetchCreateCity, fetchUpdateCityById } from "../citiesLogic.js";
import { validatorName, validatorZipCode } from "../../../../helpers/validators.helper.js";
import CheckBox from "../../generalFields/checkboxs/checkboxs.jsx";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import { FormValidation } from "../../../../hooks/formValidation.hook.jsx";
import "./citiesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function CitiesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();
    const isEdit = id && id !== "new";
    const { errorSweet, successSweet } = useSweetAlert();
    const [showOtherLang, setShowOtherLang] = useState(false);
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.primaryName = error.message; }
        if (showOtherLang) { try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.secondaryName = error.message; } };
        try { validatorZipCode(data.zipCode, TEXT.ERROR_ZIP_CODE_VALID_MIN_MAX); } catch (error) { { errors.zipCode = error.message; } };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: "" }, zipCode: "" }, validate, async (data) => {
            try {
                let result;
                if (isEdit) result = await fetchUpdateCityById(id, data);
                else result = await fetchCreateCity(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.CITY} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/cities");
            } catch (error) {
                console.error("Error: ", error.message);
                await errorSweet(error.message);
            }
        }
    );

    //Cargar ciudad si es Edit:
    useEffect(() => {
        const loadCity = async () => {
            try {
                const permission = isEdit ? "update_cities": "create_cities";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {
                    setFormData({ name: { es: formData.name?.es || "", en: formData.name?.en || "" }, zipCode: formData.zipCode });
                    return;
                }
                else {
                    const result = await fetchCityById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    const city = result.response || [];
                    setFormData(prev => ({ ...prev, ...city, name: { es: city.name?.es || "", en: city.name?.en || "" }}));
                };
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCity();
    }, [id, isEdit, user, language, verifyPrivileges]);

    return (
        <div className="citFormCont">
            <section className="citFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.CITY}:` : `${TEXT.CREATE} ${TEXT.CITY}:`} language={language} />
            </section>
            <section className="citFormSectForm">
                <form id="citForm" onSubmit={handleSubmit}>
                    <div className="citFormDivCont">
                        <div id="citFormCheckCont">
                            <CheckBox name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled className="genFormInput" cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont"
                                cNSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder= {TEXT.inputsText("m", TEXT.NAME_OF_THE_CITY)} /* {TEXT.inputsText("m", TEXT.NAME_OF_THE_CITY)} */
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted) && errors.primaryName} className="genFormInput" cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont"
                            cNSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder= {TEXT.inputsText("m", TEXT.NAME_OF_THE_CITY)} /* {TEXT.inputsText("m", `${TEXT.NAME_OF_THE_CITY} (${secondaryLang.toUpperCase()})`)} */
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted) && errors.secondaryName} className="genFormInput"
                                cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cNSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.ZIP_CODE} type="text" name="zipCode" value={formData.zipCode} placeHolder= {TEXT.inputsText("m", TEXT.ZIP_CODE)} /* {TEXT.inputsText("m", TEXT.ZIP_CODE_OF_THE_CITY)} */ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.zipCode || isSubmitted) && errors.zipCode} className="genFormInput" cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cNSectBottom="genFormInputBottomCont" />
                    </div>
                    <div className="citFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/cities">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CitiesForm;

