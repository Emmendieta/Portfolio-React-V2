import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorAlphaNumeric, validatorDate, validatorLongText, validatorName, validatorURL } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import { useLoading } from "../../../../context/Loading.Context";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreateEducationWithIamges, fetchGetEduactionPopulateById, fetchUpdateEducationByIdWithImages } from "../educationsLogic";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import SelectsV2 from "../../generalFields/selects/selectsV2/selectsV2";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { fetchGetAllHabilities } from "../../habilities/habilitiesLogic";
import "./educationsForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function EducationsForm() {
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
    const [allHabilities, setAllHabilities] = useState([]);
    const [habilitiesAvailable, setHabilitiesAvailable] = useState([]);
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const { verifyPrivileges } = userVerifyPrivileges();
    const educationsTranslations = [
        { value: "Primary School", label: { es: "Escuela Primaria", en: "Primary School" } },
        { value: "High School", label: { es: "Escuela Secundaria", en: "High School" } },
        { value: "University", label: { es: "Universidad", en: "University" } },
        { value: "Course", label: { es: "Curso", en: "Course" } },
        {
            value: "Conference", label: { es: "Conferencia", en: "Conference" }
        }, { value: "Other", label: { es: "Otro", en: "Other" } }
    ];

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorAlphaNumeric(data.institutionName?.[primaryLang], TEXT.ERROR_INSTITUTION_NAME ); } catch (error) { errors.institutionNamePrimary = error.message; };
        if (showOtherLang) try { validatorAlphaNumeric(data.institutionName?.[secondaryLang], TEXT.ERROR_INSTITUTION_NAME ); } catch (error) { errors.institutionNameSencondary = error.message; };
        try { validatorName(data.title?.[primaryLang], TEXT.ERROR_TITLE ); } catch (error) { errors.titlePrimary = error.message; };
        if (showOtherLang) try { validatorName(data.title?.[secondaryLang], TEXT.ERROR_TITLE ); } catch (error) { errors.titleSecondary = error.message; };
        try { validatorDate(data.dateStart, { allowsFuture: false, maxYearsAgo: 120 }, TEXT.ERROR_DATE ) } catch (error) { errors.dateStart = error.message; };
        try { validatorURL(data.linkInstitution), TEXT.ERROR_URL } catch (error) { errors.linkInstitution = error.message; };
        try { validatorAlphaNumeric(data.certificate), TEXT.ERROR_CERTIFICATE } catch (error) { errors.certificate = error.message; };
        try { validatorURL(data.linkCertificate), TEXT.ERROR_URL } catch (error) { errors.linkCertificate = error.message; };
        //FALTA VALIDAR typeEducation
        try { validatorLongText(data.description?.[primaryLang], TEXT.ERROR_LONG_TEXT ); } catch (error) { errors.descriptionPrimary = error.message; };
        if (showOtherLang) try { validatorLongText(data.description?.[secondaryLang], TEXT.ERROR_LONG_TEXT ); } catch (error) { errors.descriptionSecondary = error.message; };
        if (!data.typeEducation) { errors.typeEducation = `${TEXT.ERROR}: ${TEXT.ERROR_TYPE_EDUCATION}!` };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        {
            _id: "", institutionName: { es: "", en: "" }, title: { es: "", en: "", }, dateStart: "", dateEnd: "", linkInstitution: "", images: [], certificate: "", linkCertificate: "",
            finished: false, typeEducation: "", description: { es: "", en: "" }, habilities: [],
        }, validate, async (data) => {
            try {
                let result;
                if (isEdit) result = await fetchUpdateEducationByIdWithImages(id, data);
                else result = await fetchCreateEducationWithIamges(data);
                if (result?.error) throw new Error(`{TEXT.ERROR}: ${result?.error?.message}`);
                await successSweet(`${TEXT.EDUCATION} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/educations");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            }
        }
    );

    const availablesHabilities = useMemo(() => {
        const assignedIds = new Set(formData.habilities.map(hab => hab._id));
        return allHabilities.filter(hability => !assignedIds.has(hability._id));
    }, [allHabilities, formData.habilities]);

    const assignedHabilities = formData.habilities;

    const addHability = (hability) => {
        if (!hability) return;
        setFormData(prev => ({ ...prev, habilities: [...prev.habilities, hability] }));
    };

    const removeHability = (id) => {
        setFormData(prev => ({ ...prev, habilities: prev.habilities.filter(hab => hab._id !== id) }));
    };

    //Load Education if is Edit:
    useEffect(() => {
        const loadEducation = async () => {
            try {
                const permission = isEdit ? "update_educations": "create_educations";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const habilitiesRes = await fetchGetAllHabilities();
                if (!habilitiesRes || !habilitiesRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                const habilities = habilitiesRes.response || [];
                setAllHabilities(habilities);
                if (!isEdit) {
                    setFormData({ institutionName: { es: "", en: "" }, title: { es: "", en: "" }, dateStart: "", dateEnd: "", linkInstitution: "", images: [], certificate: "", linkCertificate: "", finished: false, typeEducation: "Course", description: { es: "", en: "" }, habilities: [] });
                } else { 
                    const result = await fetchGetEduactionPopulateById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const education = result.response || [];
                    setFormData(prev => ({
                        ...prev, ...education, institutionName: { es: education.institutionName?.es || "", en: education.institutionName?.en || "" }, title: { es: education.title?.es || "", en: education.title?.en || "" }, description: { es: education.description?.es || "", en: education.description?.en || "" },
                        typeEducation: education.typeEducation || "", habilities: education.habilities || [],
                    }));
                }
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducation();
    }, [id, isEdit, user, language, verifyPrivileges]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="eduFormCont">
            <section className="eduFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.EDUCATION}:` : `${TEXT.CREATE} ${TEXT.EDUCATION}:`} language={language} />
            </section>
            <section className="eduFormSectForm">
                <form id="eduForm" onSubmit={handleSubmit} >
                    <div className="eduFormDivCont">
                        <div className="eduFormCheckCont">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.INSTITUTION_NAME} (${primaryLang.toUpperCase()})`} type="text" name="institutionName" value={formData.institutionName?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_EDUCATION)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`institutionName_${primaryLang}`] || isSubmitted && errors.institutionNamePrimary)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.INSTITUTION_NAME} (${secondaryLang.toUpperCase()})`} type="text" name="institutionName" value={formData.institutionName?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_EDUCATION)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`institutionName_${secondaryLang}`] || isSubmitted && errors.institutionNameSencondary)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.TITLE} (${primaryLang.toUpperCase()})`} type="text" name="title" value={formData.title?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.TITLE)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`title_${primaryLang}`] || isSubmitted && errors.titlePrimary)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.TITLE} (${secondaryLang.toUpperCase()})`} type="text" name="title" value={formData.title?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.TITLE)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`title_${secondaryLang}`] || isSubmitted && errors.titleSecondary)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.DATE_START} type="date" name="dateStart" value={formData.dateStart ? formData.dateStart.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_START)}
                            onChange={handleChange} onBlur={(e) => handleBlur} error={(touched.dateStart || isSubmitted) && errors.dateStart}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.DATE_END} type="date" name="dateEnd" value={formData.dateEnd ? formData.dateEnd.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_END)}
                            onChange={handleChange} onBlur={(e) => handleBlur} error={(touched.dateEnd || isSubmitted) && errors.dateEnd}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <CheckBoxs name="finished" textH2={`${TEXT.FINISHED}?`} checked={formData.finished} onChange={(e) => handleChange(e)}  />
                        <Inputs textH2={TEXT.LINK_INSTITUTION} type="text" name="linkInstitution" value={formData.linkInstitution} placeHolder={TEXT.inputsText("m", TEXT.LINK_INSTITUTION)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.linkInstitution || isSubmitted) && errors.linkInstitution}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.LINK_CERTIFICATE} type="text" name="linkCertificate" value={formData.linkCertificate} placeHolder={TEXT.inputsText("m", TEXT.LINK_CERTIFICATE)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.linkCertificate || isSubmitted) && errors.linkCertificate}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <SelectsV2 label={`${TEXT.TYPE_EDUCATION}:`} name={"typeEducation"} options={educationsTranslations} value={formData.typeEducation || ""} placeholder={TEXT.SELECT_OPTION} language={language}
                            getValue={(item) => item.value} getLabel={(item, lang) => item.label?.[lang] ?? ""} onChange={handleChange} onBlur={handleBlur} error={(touched.typeEducation || isSubmitted) && errors.typeEducation}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={`${TEXT.DESCRIPTION} (${primaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[primaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`description_${primaryLang}`] || isSubmitted && errors.descriptionPrimary)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.DESCRIPTION} (${secondaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`description_${secondaryLang}`] || isSubmitted && errors.descriptionSecondary)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <div className="eduFormImgCont">
                            <ImagesManager images={formData.images} setImages={setImages} editable={true} textInput="FALTA TEXTO INPUT" genderInput="f" cThumbInput={TEXT.SELECT_IMAGES_ADD}
                                /*cThumbCont="" cThumbAddCont="" 
                                cThumbPrevContainer="" labelH2="" valueH2="" cThumbPrevImg=""
                                cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                                cImgDisplay="" idThumbBtnAdd={""}*/ />
                        </div>
                        <div className="eduFormUlsCont">
                            <Uls list={availablesHabilities} valueH1Field={`${TEXT.HABILITIES_AVAILABLES}:`} language={language} /* idH1Field={""} className={""}
                                classnameli="" classNameUl="" classNameSect="" idList={""} */ renderItem={(hability) => (
                                    <button type="button" onClick={() => addHability(hability)} className="btn btn-outline-success btnAddAssignedUls" >
                                        <H2Fields value={hability.name?.[language]} className="clBtnAddAssigned" classNameH2="clBtnAddAssignedH2"/>
                                    </button>
                                )} />
                            <Uls list={assignedHabilities} valueH1Field={`${TEXT.HABILITIES_ASSIGNED}:`} language={language} /* idH1Field={""} className={""}
                                classNameUl="" classnameli="" classNameSect="" idList={""} */ renderItem={(hability) => (
                                    <button type="button" onClick={() => removeHability(hability._id)} className="btn btn-outline-danger btnAddUnassignedUls" >
                                        <H2Fields value={hability.name?.[language]} className="clBtnRemoveAssigned" classNameH2="clBtnRemoveAssignedH2" />
                                    </button>
                                )} />
                        </div>
                        <div className="eduFormDivContBottom">
                            <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                            <a className="btn btn-outline-danger" href="/educations">{TEXT.CANCEL}</a>
                            <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EducationsForm;