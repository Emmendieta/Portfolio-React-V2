import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreateResponsibility, fetchResponsibilityById, fetchUpdateResponsibilityById } from "../responsibilitiesLogic";
import "./responsibilitiesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ResponsibilitiesForm() {
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
    const secondaryLang = language === "es" ? "en": "es";
    const { verifyPrivileges } = userVerifyPrivileges();


    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_NAME) } catch (error) { errors.primaryName = error.message; };
        if(showOtherLang) { try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_NAME) } catch (error) { errors.secondaryName = error.message; } };
        return errors;
    }, [ primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: ""} }, validate, async (data)  => {
            try {
                let result;
                if(isEdit) result = await fetchUpdateResponsibilityById(id, data);
                else result = await fetchCreateResponsibility(data);
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.RESPONSIBILITY} ${isEdit ? TEXT.UPDATE_SUCCESS: TEXT.CREATE_SUCCESS}`);
                navigate("/responsibilities");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            }
        }
    );

    //Load responsibility if is Edit:
    useEffect(() => {
        const loadResponsibility = async () => {
            try {
                const permission = isEdit ? "update_responsibilites": "create_responsibilities";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if(!isEdit) {
                    setFormData({ name: { es: formData.name?.es || "", en: formData.name?.en || "" }});
                    return;
                } else {
                    const result = await fetchResponsibilityById(id);
                    if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const responsibility = result.response || [];
                    setFormData(prev => ({ ...prev, ...responsibility, name: { es: responsibility.name?.es || "", en: responsibility.name?.en || "" }}));
                };
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadResponsibility();
    }, [id, isEdit, user, language, verifyPrivileges]);

    return (
        <div className="respFormCont">
            <section className="respFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.RESPONSIBILITY}:`: `${TEXT.CREATE} ${TEXT.RESPONSIBILITY}:`} language={language}/>
            </section>
            <section className="respFormSectForm">
                <form id="respForm" onSubmit={handleSubmit}>
                    <div className="respFormDivCont">
                        <div className="respFormCheckCont">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted && errors.primaryName)} 
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted && errors.secondaryName)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                    </div>
                    <div className="respFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/responsibilities">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE: TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ResponsibilitiesForm;