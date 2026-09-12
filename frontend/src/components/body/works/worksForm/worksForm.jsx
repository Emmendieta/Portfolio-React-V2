import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { validatorAlphaNumeric, validatorDate, validatorLongText, validatorURL } from "../../../../helpers/validators.helper";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import { fetchCreateWorkWithImages, fetchGetWorkByIdPopulate, fetchUpdateWorkByIdWithImages } from "../worksLogis";
import { fetchGetAllResponsibilities } from "../../responsibilities/responsibilitiesLogic";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import "./worksForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function WorksForm() {
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
    const [allResponsibilities, setAllResponsibilities] = useState([]);
    const [responsibilitiesAvailable, setResonsibilitiesAvailable] = useState([]);
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorAlphaNumeric((data.jobTitle?.[primaryLang]), TEXT.ERROR_JOB_TITLE) } catch (error) { errors.jobTitlePrimary = error.message; };
        if (showOtherLang) { try { validatorAlphaNumeric((data.jobTitle?.[secondaryLang]), TEXT.ERROR_JOB_TITLE) } catch (error) { errors.jobTitleSecondary = error.message; } };
        try { validatorDate(data.dateStart), TEXT.ERROR_DATE } catch (error) { errors.dateStart = error.message; };
        try { validatorAlphaNumeric((data.company?.[primaryLang]), TEXT.ERROR_COMPANY ) } catch (error) { errors.companyPrimary = error.message; };
        if (showOtherLang) { try { validatorAlphaNumeric((data.company?.[secondaryLang]), TEXT.ERROR_COMPANY ) } catch (error) { errors.companySecondary = error.message; } };
        try { validatorURL(data.linkCompany), TEXT.ERROR_URL } catch (error) { errors.linkCompany = error.message; };
        try { validatorLongText(data.description?.[primaryLang], TEXT.ERROR_LONG_TEXT )} catch(error) { errors.descriptionPrimary = error.message; };
        if(showOtherLang) { try { validatorLongText(data.description?.[secondaryLang]), TEXT.ERROR_LONG_TEXT } catch (error) { errors.descriptionSecondary = error.message; }};
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", jobTitle: { es: "", en: "" }, dateStart: "", dateEnd: "", company: { es: "", en: "" }, linkCompany: "", finished: false, description: { es: "", en: "" }, images: [], responsibilities: [] },
        validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateWorkByIdWithImages(id, data);
                else result = await fetchCreateWorkWithImages(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.WORK} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}!`);
                await navigate("/works");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    const availableResponsibilities = useMemo(() => {
        const assignedIds = new Set(formData.responsibilities.map(resp => resp._id));
        return allResponsibilities.filter(responsibility => !assignedIds.has(responsibility._id));
    }, [allResponsibilities, formData.responsibilities]);

    const assignedResponsibilities = formData.responsibilities;

    const addResponsibility = (responsibility) => {
        if (!responsibility) return;
        setFormData(prev => ({ ...prev, responsibilities: [...prev.responsibilities, responsibility] }));
    };

    const removeResponsibility = (id) => {
        setFormData(prev => ({ ...prev, responsibilities: prev.responsibilities.filter(resp => resp._id !== id) }));
    };

    //Load Work if is Edit:
    useEffect(() => {
        const loadWork = async () => {
            try {
                if(!user) return;
                const permission = isEdit ? "update_works": "create_works";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const responsibilitiesRes = await fetchGetAllResponsibilities();
                if (!responsibilitiesRes || !responsibilitiesRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                const responsibilities = responsibilitiesRes.response || [];
                console.log("RESPONSIBILITIES WORK CARD", responsibilities)
                setAllResponsibilities(responsibilities);
                if (!isEdit) {
                    //FALTA PARA UN NUEVO WORK
                    return;
                } else { 
                    const result = await fetchGetWorkByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const work = result.response || [];
                    setFormData(prev => ({
                        ...prev, _id: work._id, jobTitle: { es: work.jobTitle?.es || "", en: work.jobTitle?.en || "" }, dateStart: work.dateStart,
                        dateEnd: work.dateEnd, company: { es: work.company?.es || "", en: work.company?.en || "" }, linkCompany: work.linkCompany,
                        finished: work.finished || false, description: { es: work.description?.es || "", en: work.description?.en || "" },
                        images: work.images?.length ? work.images.map(img => ({ publicId: img.publicId, url: img.url, hash: img.hash, width: img.width, height: img.height, isMain: img.isMain || false })) : [],
                        responsibilities: work.responsibilities || []
                    }));
                }
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWork();
    }, [id, isEdit, user, language]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="workFormCont">
            <section className="workFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.WORK}:` : `${TEXT.CREATE} ${TEXT.WORK}:`} language={language} />
            </section>
            <section className="workFormSectForm">
                <form id="workForm" onSubmit={handleSubmit}>
                    <div className="workFormCheckCont">
                        <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} language={language} readOnly={true} disabled={true}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.JOB_TITLE} (${primaryLang.toUpperCase()})`} type="text" name="jobTitle" value={formData.jobTitle?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`jobTitle_${primaryLang}`] || isSubmitted) && errors.jobTitlePrimary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.JOB_TITLE} (${secondaryLang.toUpperCase()})`} type="text" name="jobTitle" value={formData.jobTitle?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`jobTitle_${secondaryLang}`] || isSubmitted) && errors.jobTitleSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.DATE_START} type="date" name="dateStart" value={formData.dateStart ? formData.dateStart.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_START)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.dateStart || isSubmitted) && errors.dateStart} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.DATE_END} type="date" name="dateEnd" value={formData.dateEnd ? formData.dateEnd.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_END)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.dateEnd || isSubmitted) && errors.dateEnd} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={`${TEXT.COMPANY} (${primaryLang.toUpperCase()})`} type="text" name="company" value={formData.company?.[primaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.COMPANY)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`company_${primaryLang}`] || isSubmitted) && errors.companyPrimary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.COMPANY} (${secondaryLang.toUpperCase()})`} type="text" name="company" value={formData.company?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.COMPANY)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`company_${secondaryLang}`] || isSubmitted) && errors.companySecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.LINK_COMPANY} type="text" name="linkCompany" value={formData.linkCompany} placeHolder={TEXT.inputsText("m", TEXT.LINK_COMPANY)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.linkCompany || isSubmitted) && errors.linkCompany} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        //FALTA CHECKBOX FINISHED
                        <Inputs textH2={`${TEXT.DESCRIPTION} (${primaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[primaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`description_${primaryLang}`] || isSubmitted) && errors.descriptionPrimary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.DESCRIPTION} (${secondaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`description_${secondaryLang}`] || isSubmitted) && errors.descriptionSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                    </div>
                    <div className="workFormImgCont">
                        <ImagesManager images={formData.images} setImages={setImages} editable={true} textInput="FALTA TEXTO IMAGES" genderInput="m"
                            cThumbCont="" cThumbAddCont="" cThumbInput={TEXT.SELECT_IMAGES_ADD}
                            cThumbPrevContainer="" labelH2="" valueH2="" cThumbPrevImg=""
                            cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                            cImgDisplay="" idThumbBtnAdd={""} />
                    </div>
                    <div className="workFormUlsCont">
                        <Uls list={availableResponsibilities} valueH1Field={TEXT.RESPONSIBILITIES_AVAILABLE} language={language} idH1Field={""} className={""}
                            classnameli="" classNameSect="" idList={""} renderItem={(responsibility) => (
                                <button type="button" onClick={() => addResponsibility(responsibility)} className="">
                                    <H2Fields value={responsibility.name?.[language]} className="" />
                                </button>
                            )} />
                        <Uls list={assignedResponsibilities} valueH1Field={TEXT.RESPONSIBILITIES_ASSIGNED} language={language} idH1Field={""}
                            classnameli="" classNameSect="" idList={""} renderItem={(responsibility) => (
                                <button type="button" onClick={() => removeResponsibility(responsibility._id)} className="">
                                    <H2Fields value={responsibility.name?.[language]} className="" />
                                </button>
                            )} />
                    </div>
                    <div className="workFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/works">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default WorksForm;