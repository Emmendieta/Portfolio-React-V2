import { useContext } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useLoading } from "../../../../context/Loading.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useCallback } from "react";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import { useEffect } from "react";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreateHability, fetchHabilityById, fetchUpdateHabilityById } from "../habilitiesLogic";
import "./habilitiesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function HabilitiesForm() {
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
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_NAME) } catch (error) { errors.primaryName = error.messsage; };
        if (showOtherLang) { try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_NAME) } catch (error) { errors.secondaryName = error.messsage; }; };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: " " } }, validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateHabilityById(id, data);
                else result = await fetchCreateHability(data);
                if (result?.error) await errorSweet(`${TEXT.ERROR}: ${result?.error?.messsage}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.HABILITY} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/habilities");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.messsage}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.messsage}` || TEXT.TEXT_ERROR_OOPS);
            }
        }
    );

    //Load hability if is Edit:
    useEffect(() => {
        const loadHability = async () => {
            try {
                const permission = isEdit ? "update_habilities": "create_habilities";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {
                    setFormData({ name: { es: formData.name?.es || "", en: formData.name?.en || "" } });
                    return;
                }
                else {
                    const result = await fetchHabilityById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.messsage}` || TEXT.TEXT_ERROR_OOPS);
                    const hability = result.response || [];
                    setFormData(prev => ({ ...prev, ...hability, name: { es: hability.name?.es || "", en: hability.name?.en || "" } }));
                };
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.messsage}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.messsage}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadHability();
    }, [id, isEdit, user, language]);

    return (
        <div className="habFormCont">
            <section className="habFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.HABILITY}:` : `${TEXT.CREATE} ${TEXT.HABILITY}:`} language={language} />
            </section>
            <section>
                <form id="habForm" onSubmit={handleSubmit}>
                    <div className="habFormDivCont">
                        <div className="habFormCheckForm">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_HABILITY)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted && errors.primaryName)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_HABILITY)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}` || isSubmitted && errors.secondaryName])}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                    </div>
                    <div className="habFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/habilites">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default HabilitiesForm;