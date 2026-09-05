import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorAlphaNumeric, validatorDate, validatorLongText, validatorURL } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import { fetchCreateProyectWithImages, fetchGetProyectByIdPopulate, fetchUpdateProyectByIdWithImages } from "../proyectsLogic";
import { fetchGetAllResponsibilities } from "../../responsibilities/responsibilitiesLogic";
import { fetchGetAllSkills } from "../../skills/skillsLogic";
import { fetchGetAllCategories } from "../../categories/categoriesLogic";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import "./proyectsForm.css";

function ProyectsForm() {
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
    const [allSkills, setAllSkills] = useState([]);
    const [skillsAvailables, setSkillsAvailables] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [categoriesAvailables, setCategoriesAvailables] = useState([]);
    const [allResponsibilities, setAllResponsibilities] = useState([]);
    const [responsibilitiesAvailables, setResponsibilitiesAvailables] = useState([]);
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorAlphaNumeric((data.name?.[primaryLang]), "FALTA TEXTO ERROR ALPHA NUMERIC") } catch (error) { errors.namePrimary = error.message; };
        if (showOtherLang) try { validatorAlphaNumeric((data.name?.[secondaryLang]), "FALTA TEXTO ERRROR ALPHA NUMERIC") } catch (error) { errors.nameSecondary = error.message; };
        try { validatorDate((data.dateStart), "FALTA TEXTO ERROR DATE") } catch (error) { errors.dateStart = error.message; };
        try { validatorDate(data.dateEnd), "FALTA TEXTO ERROR DATE" } catch (error) { errors.dateEnd = error.message; };
        try { validatorAlphaNumeric(data.company?.[primaryLang]), "FALTA TEXTO ERROR ALPHA NUMERIC" } catch (error) { errors.companyPrimary = error.message; };
        if (showOtherLang) try { validatorAlphaNumeric(data.company?.[secondaryLang]), "FALTA TEXTO ERROR ALPHA NUMERIC" } catch (error) { errors.companySecondary = error.message; };
        try { validatorURL((data.linkCompany)), "FALTA TEXTO ERROR URL" } catch (error) { errors.linkCompany = error.message; };
        try { validatorURL((data.linkProyect)), "FALTA TEXTO ERROR" } catch (error) { errors.linkCompany = error.message; };
        try { validatorLongText((data.description?.[primaryLang]), "FALTA TEXTO ERROR ALPHA NUMERIC") } catch (error) { errors.descriptionPrimary = error.message; };
        if (showOtherLang) try { validatorLongText((data.description?.[secondaryLang]), "FALTA TEXTO ERROR ALPHA NUMERIC") } catch (error) { errors.descriptionSecondary = error.message; };
        //FALTA VALIDAR SKILLS
        //FALTA VALIDAR CATEGORIES
        //FALTA VALIDAR RESPONSIBILITIES
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        {
            _id: "", name: { es: "", en: "" }, dateStart: "", dateEnd: "", company: { es: "", en: "" }, linkProyect: "", linkCompany: "", description: { es: "", en: "" },
            skills: [], categories: [], responsibilities: [], images: []
        }, validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateProyectByIdWithImages(id, data);
                else result = await fetchCreateProyectWithImages(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.PROYECT} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/proyects");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Responsibilities:
    const availablesResponsibilities = useMemo(() => {
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

    //Skills:
    const availablesSkills = useMemo(() => {
        const assignedIds = new Set(formData.skills.map(skill => skill._id));
        return allSkills.filter(skill => !assignedIds.has(skill._id));
    }, [allSkills, formData.skills]);

    const assignedSkills = formData.skills;

    const addSkill = (skill) => {
        if (!skill) return;
        setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    };

    const removeSkill = (id) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill._id !== id) }));
    };

    //Categories:
    const availableCategories = useMemo(() => {
        const assignedIds = new Set(formData.categories.map(cat => cat._id));
        return allCategories.filter(category => !assignedIds.has(category._id));
    }, [allCategories, formData.categories]);

    const assignedCategories = formData.categories;

    const addCategory = (category) => {
        if (!category) return;
        setFormData(prev => ({ ...prev, categories: [...prev.categories, category] }));
    };

    const removeCategory = (id) => {
        setFormData(prev => ({ ...prev, categories: prev.categories.filter(category => category._id !== id) }))
    };

    //Load Proyect if is Edit:
    useEffect(() => {
        const loadProyect = async () => {
            try {
                const permission = isEdit ? "update_proyects": "create_proyects";
                const allowded = await verifyPrivileges(user, permission);
                if(!allowded) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const responsibilitiesRes = await fetchGetAllResponsibilities();
                if (!responsibilitiesRes || !responsibilitiesRes.response) {
                    console.error(TEXT.RESPONSIBILITIES_NOT_FOUND);
                    return await errorSweet(TEXT.RESPONSIBILITIES_NOT_FOUND);
                };
                const skillsRes = await fetchGetAllSkills();
                if (!skillsRes || !skillsRes.response) {
                    console.error(TEXT.SKILLS_NOT_FOUND);
                    return await errorSweet(TEXT.SKILLS_NOT_FOUND);
                };
                const categoriesRes = await fetchGetAllCategories();
                if (!categoriesRes || !categoriesRes.response) {
                    console.error(TEXT.NO_CATEGORIES_FOUND);
                    return await errorSweet(TEXT.NO_CATEGORIES_FOUND);
                };
                setAllResponsibilities(responsibilitiesRes.response || []);
                setAllSkills(skillsRes.response || []);
                setAllCategories(categoriesRes.response || []);
                if (!isEdit) {
                    setFormData({
                        name: { es: "", en: "" }, dateStart: "", dateEnd: "", company: { es: "", en: "" },
                        linkProyect: "", linkCompany: "", description: { es: "", en: "" }, skills: [], categories: [],
                        responsibilities: [], images: [], order: ""
                    });
                } else {
                    const result = await fetchGetProyectByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const proyect = result.response || [];
                    setFormData(prev => ({
                        ...prev, ...proyect, name: { es: proyect.name?.es || "", en: proyect.name?.en || "" },
                        company: { es: proyect.company?.es || "", en: proyect.company?.en || "" }, description: { es: proyect.description?.es || "", en: proyect.description.en || "" },
                        responsibilities: proyect.responsibilities || [], skills: proyect.skills || [], categories: proyect.categories || [],
                        images: proyect.images || []
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
        loadProyect();
    }, [id, isEdit, user, language]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="proyFormCont">
            <section className="proyFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.PROYECT}:` : `${TEXT.CREATE} ${TEXT.PROYECT}:`} language={language} />
            </section>
            <section className="proyFormSectForm">
                <form id="proyForm" onSubmit={handleSubmit}>
                    <div className="proyFormDivCont">
                        <div className="proyFormCheckCont">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} language={language} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted && errors.namePrimary)}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted && errors.nameSecondary)}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <Inputs textH2={TEXT.DATE_START} type="date" name="dateStart" value={formData.dateStart ? formData.dateStart.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_START)}
                            onChange={handleChange} onBlur={handleBlur} error={touched.dateStart || isSubmitted && errors.dateStart}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        <Inputs textH2={TEXT.DATE_END} type="date" name="dateEnd" value={formData.dateEnd ? formData.dateEnd.slice(0, 10) : ""} placeHolder={TEXT.inputsText("f", TEXT.DATE_END)}
                            onChange={handleChange} onBlur={handleBlur} error={touched.dateEnd || isSubmitted && errors.dateEnd}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        <Inputs textH2={`${TEXT.COMPANY} (${primaryLang.toUpperCase()})`} type="text" name="company" value={formData.company?.[primaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.COMPANY_NAME)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`company_${primaryLang}`] || isSubmitted && errors.companyPrimary)}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.COMPANY} (${secondaryLang.toUpperCase()})`} type="text" name="company" value={formData.company?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.COMPANY_NAME)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`company_${secondaryLang}`] || isSubmitted && errors.companySecondary)}
                                className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <Inputs textH2={TEXT.LINK_COMPANY} type="text" name="linkCompany" value={formData.linkCompany} placeHolder={TEXT.inputsText("m", TEXT.LINK_COMPANY)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.linkCompany || isSubmitted && errors.linkCompany)}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        <Inputs textH2={TEXT.LINK_PROYECT} type="text" name="linkProyect" value={formData.linkProyect} placeHolder={TEXT.inputsText("m", TEXT.LINK_PROYECT)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.linkProyect || isSubmitted && errors.linkProyect)}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        <Inputs textH2={`${TEXT.DESCRIPTION} (${primaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[primaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`description_${primaryLang}`] || isSubmitted ) && errors.descriptionPrimary }
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.DESCRIPTION} (${secondaryLang.toUpperCase()})`} type="text" name="description" value={formData.description?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("f", TEXT.DESCRIPTION)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`description_${secondaryLang}`] || isSubmitted ) && errors.descriptionSecondary } 
                                className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <div className="proyFormUlsCont">
                            <div className="proyFormUlsDivCont">
                                <Uls list={availableCategories} valueH1Field={`${TEXT.CATEGORIES_AVAILABLE}:`} language={language} /* idH1Field={""} className=""
                                    classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(category) => (
                                        <button type="button" onClick={() => addCategory(category)} className="btn btn-outline-success btnAddAssignedUls" >
                                            <H2Fields value={category.name?.[language]} className="clBtnAddAssigned" classNameH2="clBtnAddAssignedH2" />
                                        </button>
                                    )} />
                                <Uls list={assignedCategories} valueH1Field={`${TEXT.CATEGORIES_ASSIGNED}:`} language={language} /* idH1Field={""} className=""
                                    classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(category) => (
                                        <button type="button" onClick={() => removeCategory(category._id)} className="btn btn-outline-danger btnAddUnassignedUls" >
                                            <H2Fields value={category.name?.[language]} className="clBtnRemoveAssigned" classNameH2="clBtnRemoveAssignedH2" />
                                        </button>
                                    )} />
                            </div>
                            <div className="proyFormUlsDivCont">
                                <Uls list={availablesResponsibilities} valueH1Field={`${TEXT.RESPONSIBILITIES_AVAILABLE}:`} language={language} /* idH1Field={""} className=""
                                   classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(responsibility) => (
                                        <button type="button" onClick={() => addResponsibility(responsibility)} className="btn btn-outline-success btnAddAssignedUls" >
                                            <H2Fields value={responsibility.name?.[language]} className="clBtnAddAssigned" classNameH2="clBtnAddAssignedH2" />
                                        </button>
                                    )} />
                                <Uls list={assignedResponsibilities} valueH1Field={`${TEXT.RESPONSIBILITIES_ASSIGNED}:`} language={language} /* idH1Field={""} className=""
                                    classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(responsibility) => (
                                        <button type="button" onClick={() => removeResponsibility(responsibility._id)} className="btn btn-outline-danger btnAddUnassignedUls">
                                            <H2Fields value={responsibility.name?.[language]} className="clBtnRemoveAssigned" classNameH2="clBtnRemoveAssignedH2" />
                                        </button>
                                    )} />
                            </div>
                            <div className="proyFormUlsDivCont">
                                <Uls list={availablesSkills} valueH1Field={`${TEXT.SKILLS_AVAILABLE}:`} language={language} /* idH1Field={""} className=""
                                    classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(skill) => (
                                        <button type="button" onClick={() => addSkill(skill)} className="btn btn-outline-success btnAddAssignedUls" >
                                            <H2Fields value={skill.name?.[language]} className="clBtnAddAssigned" classNameH2="clBtnAddAssignedH2" />
                                        </button>
                                    )} />
                                <Uls list={assignedSkills} valueH1Field={`${TEXT.SKILLS_ASSIGNED}:`} language={language} /* idH1Field={""} className=""
                                     classNameSect="" classNameUl="" classnameli="" idList={""} */ renderItem={(skill) => (
                                        <button type="button" onClick={() => removeSkill(skill._id)} className="btn btn-outline-danger btnAddUnassignedUls" >
                                            <H2Fields value={skill.name?.[language]} className="clBtnRemoveAssigned" classNameH2="clBtnRemoveAssignedH2" />
                                        </button>
                                    )} />
                            </div>
                        </div>
                        <div className="proyFormImgCont">
                            <ImagesManager images={formData.images} setImages={setImages} editable={true} textInput="FALTA TEXTO INPUT" genderInput="f" cThumbInput={TEXT.SELECT_IMAGES_ADD}
                                /*cThumbCont="" cThumbAddCont="" 
                                cThumbPrevContainer="" labelH2="" valueH2="" cThumbPrevImg=""
                                cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                                cImgDisplay="" idThumbBtnAdd={""}*/ />
                        </div>
                        <div className="proyFormDivContBottom">
                            <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                            <a className="btn btn-outline-danger" href="/proyects">{TEXT.CANCEL}</a>
                            <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ProyectsForm;