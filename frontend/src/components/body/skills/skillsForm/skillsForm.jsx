import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorAlphaNumeric, validatorNumber } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import { fetchCreateSkillWithImages, fetchGetSkillById, fetchUpdateSkillByIdWithImages } from "../skillsLogic";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBoxs from "../../generalFields/checkboxs/checkboxs";
import Inputs from "../../generalFields/Inputs/inputs";
import SelectsV2 from "../../generalFields/selects/selectsV2/selectsV2";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import "./skillsForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SkillsForm() {
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
    const skillsTranslations = [{ value: "Hard", label: { es: "Habilidades Duras", en: "Hard Skills" } },
    { value: "Soft", label: { es: "Habilidades Blandas", en: "Soft Skills" } }];
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorAlphaNumeric(data.name?.[primaryLang], "FALTA TEXTO ERROR ALPHA NUMERICO"); } catch (error) { errors.skillNamePrimary = error.message; };
        if (showOtherLang) try { validatorAlphaNumeric(data.name?.[secondaryLang], "FALTA TEXTO ERROR ALPHA NUMERICO"); } catch (error) { errors.skillsNameSecondary = error.message; };
        try { validatorNumber(data.percent, "FALTA TEXTO DEL ERROR Y ESTE HAY QUE VALIDARLO COMO PORCENTAJE!!!!") } catch (error) { errors.percent = error.message };
        if (!data.type) { errors.type = "FALTA TEXTO ERROR" };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        {
            _id: "", name: { es: "", en: "" }, percent: "", type: "", images: [], order: ""
        }, validate, async (data) => {
            try {
                let result;
                if (isEdit) result = await fetchUpdateSkillByIdWithImages(id, data);
                else result = await fetchCreateSkillWithImages(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.SKILL} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/skills");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            }
        }
    );

    //Load Skills if is Edit:
    useEffect(() => {
        const loadSkill = async () => {
            try {
                if(!user) return;
                const permission = isEdit ? "update_skills": "create_skills";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {
                    setFormData({ name: { es: "", en: "" }, percent: "", type: "", images: [], order: "" });
                } else {
                    const result = await fetchGetSkillById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    const skill = result.response || [];
                    setFormData(prev => ({
                        ...prev, ...skill,
                        name: { es: skill.name?.es || "", en: skill.name.en || "" }, type: skill.type || "", images: skill.images?.length ?
                            skill.images.map(img => ({ publicId: img.publicId, url: img.url, hash: img.hash, width: img.width, height: img.height, isMain: img.isMain || false })) : []
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
        loadSkill();
    }, [id, isEdit, user, language]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="skillFormCont">
            <section className="skillFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.SKILL}:` : `${TEXT.CREATE} ${TEXT.SKILL}:`} language={language} />
            </section>
            <section className="skillSectForm">
                <form id="skillForm" onSubmit={handleSubmit}>
                    <div className="skillFormDivCont">
                        <div className="skillFormCheckCont">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={((e) => setShowOtherLang(e.target.checked))} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled className={""} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted && errors.skillNamePrimary)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted && errors.skillsNameSecondary)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.PERCENT} type="number" name="percent" value={formData.percent} placeHolder={TEXT.inputsText("m", TEXT.PERCENT)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.percent || isSubmitted) && errors.percent}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    </div>
                    <div className="skillFormSelectCont">
                        <SelectsV2 label={TEXT.TYPE} name={"type"} options={skillsTranslations} value={formData.type || ""} language={language} placeholder={TEXT.SELECT_A_TYPE}
                            getValue={(item) => item.value} getLabel={(item, lang) => item.label?.[lang] ?? ""} onChange={handleChange} onBlur={handleBlur} error={(touched.type || isSubmitted) && errors.type}
                            className={""} cNContainer="" cNSecTop="" cnSectBottom="" />
                    </div>
                    <div className="skillFormImgCont">
                        <ImagesManager images={formData.images} setImages={setImages} editable={true} textInput="FALTA TEXTO INPUT" genderInput="f" cThumbInput={TEXT.SELECT_IMAGES_ADD}
                            /* cThumbCont="" cThumbAddCont="" 
                            cThumbPrevContainer="" labelH2="" valueH2="" cThumbPrevImg=""
                            cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                            cImgDisplay="" idThumbBtnAdd={""} */ />
                    </div>
                    <div className="skillFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/skills">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SkillsForm;