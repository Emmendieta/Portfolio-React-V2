import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorAlphaNumeric, validatorURL } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import { fetchCreateSocialWithImages, fetchGetSocialById, fetchUpdateSocialWithImages } from "../socialsLogic";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import SelectsV2 from "../../generalFields/selects/selectsV2/selectsV2";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import "./socialsForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SocialsForm() {
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
    const socialsTranslations = [
        { value: "Social", label: { es: "Red Social", en: "Social Network" } },
        { value: "Contact", label: { es: "Contacto", en: "Contact" } }
    ];
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorAlphaNumeric(data.name, TEXT.ERROR_NAME_ALPHANUMERIC) } catch (error) { errors.name = error.message; };
        try { validatorURL(data.url, TEXT.ERROR_URL) } catch (error) { errors.url = error.message; };
        if (!data.typeSocial) { errors.typeSocial = TEXT.ERROR_TYPE };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        {
            _id: "", name: "", url: "", typeSocial: "", user: "", password: "", images: []
        }, validate, async (data) => {
            try {
                let result;
                if (isEdit) result = await fetchUpdateSocialWithImages(id, data);
                else result = await fetchCreateSocialWithImages(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.SOCIAL} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/socials");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            }
        }
    );

    //Load Social if is Edit:
    useEffect(() => {
        const loadSocial = async () => {
            try {
                if(!user) return;
                const permission = isEdit ? "update_socials": "create_socials";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {
                    setFormData({ name: "", url: "", typeSocial: "", user: "", password: "", images: [] });
                } else {

                    const result = await fetchGetSocialById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const social = result.response || [];
                    setFormData(prev => ({
                        ...prev, ...social, name: social.name, url: social.url, typeSocial: social.typeSocial, user: social.user,
                        password: social.password, images: social.images || []
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
        loadSocial();
    }, [id, isEdit, user, language]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="socFormCont">
            <section className="socFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.SOCIAL}` : `${TEXT.CREATE} ${TEXT.SOCIAL}:`} language={language} />
            </section>
            <section className="socFormSectForm">
                <form id="socForm" onSubmit={handleSubmit} >
                    <div className="socFormDivCont">
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={TEXT.NAME} type="text" name="name" value={formData.name} placeHolder={TEXT.inputsText("m", TEXT.NAME)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.name || isSubmitted) && errors.name}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.SOCIAL_URL} type="text" name="url" value={formData.url} placeHolder={TEXT.inputsText("f", TEXT.SOCIAL_URL)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.url || isSubmitted) && errors.url}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.USER} type="text" name="user" value={formData.user} placeHolder={TEXT.inputsText("m", TEXT.USER)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.user || isSubmitted) && errors.user}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.PASSWORD} type="password" name="password" value={formData.password} placeHolder={TEXT.inputsText("f", TEXT.PASSWORD)}
                            onChange={handleChange} onBlur={handleBlur} error={(touched.password || isSubmitted) && errors.password}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    </div>
                    <div className="socFormSelectCont">
                        <SelectsV2 label={TEXT.TYPE_SOCIAL} name={"typeSocial"} options={socialsTranslations} value={formData.typeSocial || ""} placeholder={TEXT.SELECT_TYPE_SOCIAL}
                            language={language} getValue={(item) => item.value} getLabel={(item, lang) => item.label?.[lang] ?? ""} onChange={handleChange} onBlur={handleBlur}
                            error={(touched.typeSocial || isSubmitted) && errors.typeSocial} className="" cNContainer="" cNSecTop="" cnSectBottom="" />
                    </div>
                    <div className="socFormImgCont">
                        <ImagesManager images={formData.images} setImages={setImages} editable={true} textInput="FALTA TEXTO INPUT" genderInput="f" cThumbInput={TEXT.SELECT_IMAGES_ADD}
                            /* cThumbCont="" cThumbAddCont="" 
                            cThumbPrevContainer="" labelH2="" valueH2="" cThumbPrevImg=""
                            cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                            cImgDisplay="" idThumbBtnAdd={""} */ />
                    </div>
                    <div className="socFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/socials">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SocialsForm;