import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import TextAreaFields from "../../generalFields/textAreaFields/textAreaFields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreatePermission, fetchPermissionById, fetchUpdatePermissionById } from "../permissionsLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import { validatorKey, validatorLongText, validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./permissionsForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function PermissionsForm() {
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
        try { validatorKey(data.key, TEXT.ERROR_INVALID_KEY); } catch (error) { errors.key = error.message; };
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.namePrimary = error.message; };
        if (showOtherLang) {
            try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.nameSecondary = error.message; };
        };
        try { validatorLongText(data.description?.[primaryLang], TEXT.ERROR_LONG_TEXT ) } catch (error) { errors.descriptionPrimary = error.message; };
        if(showOtherLang){ try { validatorLongText(data.description?.[secondaryLang], TEXT.ERROR_LONG_TEXT );} catch(error) { errors.descriptionSecondary = error.message; }};
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", key: "", name: { es: "", en: "" }, description: { es: "", en: "" } }, validate, async (data) => {
            try {
                setLoading(true);
                startLoading();
                let result;
                if (isEdit) result = await fetchUpdatePermissionById(id, data);
                else result = await fetchCreatePermission(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message} ` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.PERMISSION} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/permissions");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Cargamos el permission en caso de edit:
    useEffect(() => {
        const loadPermission = async () => {
            try {
                const permission = isEdit ? "update_permissions": "create_permissions";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {

                }
                else {
                    const result = await fetchPermissionById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const permission = result.response || [];
                    setFormData(permission);
                }
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadPermission();
    }, [id, isEdit, user, language]);

    return (
        <div className="permFormCont">
            <section className="permFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.PERMISSION}:` : `${TEXT.CREATE} ${TEXT.PERMISSION}:`} language={language} />
            </section>
            <section className="permFormSectForm">
                <form id="permForm" onSubmit={handleSubmit}>
                    <div className="permFormDivCont">
                        <div className="permFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.KEY} type="text" name={"key"} placeHolder={TEXT.inputsText("f", TEXT.KEY)}/* {TEXT.inputsText("m", TEXT.KEY_OF_THE_PERMISSION)} */ value={formData.key}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.key || isSubmitted) && errors.key} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name={"name"} placeHolder={TEXT.inputsText("m", TEXT.NAME)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PERMISSION)}  */ value={formData.name?.[primaryLang] || ""}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted) && errors.namePrimary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name={"name"} value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PERMISSION)} */
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted) && errors.nameSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <TextAreaFields label={`${TEXT.DESCRIPTION} (${primaryLang.toUpperCase()})`} name={"description"} value={formData.description?.[primaryLang] || ""} placeholder={TEXT.inputsText("f", TEXT.DESCRIPTION)}/* {TEXT.inputsText("f",`${TEXT.DESCRIPTION} (${primaryLang.toUpperCase()})`)} */ idText={formData._id}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`description_${primaryLang}`] || isSubmitted) && errors.descriptionPrimary} language={language} />
                        {showOtherLang && (
                            <TextAreaFields label={`${TEXT.DESCRIPTION} (${secondaryLang.toUpperCase()})`} value={formData.description?.[secondaryLang] || ""} name={"description"} placeholder={TEXT.inputsText("f", TEXT.DESCRIPTION)}/* {TEXT.inputsText("f", `${TEXT.DESCRIPTION} (${secondaryLang.toUpperCase()})`)} */
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`description_${secondaryLang}`] || isSubmitted) && errors.descriptionSecondary} language={secondaryLang} />
                        )}
                    </div>
                    <div className="permFormDivContBottom">
                        <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" id="btnCancel" href="/permissions">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default PermissionsForm;