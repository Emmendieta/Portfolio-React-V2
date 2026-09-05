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
import { fetchCreateCategory, fetchCreateCategoryWithImages, fetchGetCategoryById, fetchUpdateCategoryById, fetchUpdateCategoryByIdWithImages } from "../categoriesLogic";
import "./categoriesForm.css";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function CategoriesForm() {
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
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.primaryName = error.message; };
        if (showOtherLang) try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.secondaryName = error.message; };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: "" }, images: [] }, validate, async (data) => {
            try {
                let result;
                if (isEdit) result = await fetchUpdateCategoryByIdWithImages(id, data);
                else result = await fetchCreateCategoryWithImages(data);
                if (result?.error) throw new Error(`${TEXT.ERROR}: ${result?.error.message}`);
                await successSweet(`${TEXT.CATEGORY} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/categories");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            }
        }
    );

    //Load Category if is Edit:
    useEffect(() => {
        const loadCategory = async () => {
            try {
                const permission = isEdit ? "update_categories": "create_categories";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                if (!isEdit) {
                    setFormData({ name: { es: formData.name?.es || "", en: formData.name?.en || "" }, images: [] });
                } else {
                    const result = await fetchGetCategoryById(id);
                    if (result?.error) return await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                    const category = result.response || [];
                    setFormData(prev => ({
                        ...prev, ...category, name: { es: category.name?.es || "", en: category.name?.en || "" }, images: category.images?.length ?
                            category.images.map(img => ({ publicId: img.publicId, url: img.url, hash: img.hash, width: img.width, height: img.height, isMain: img.isMain || false })) : []
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
        loadCategory();
    }, [id, isEdit, user, language, verifyPrivileges]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));


    return (
        <div className="catFormCont">
            <section className="catFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.CATEGORY}:` : `${TEXT.CREATE} ${TEXT.CATEGORY}:`} language={language} />
            </section>
            <section className="catFormSectForm">
                <form id="catForm" onSubmit={handleSubmit}>
                    <div className="catFormDivCont">
                        <div className="catFormCheckCont">
                            <CheckBoxs name="showOtherLang" textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={((e) => setShowOtherLang(e.target.checked))} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name="_id" value={formData._id} readOnly disabled
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CATEGORY)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted && errors.primaryName)}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name="name" value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CATEGORY)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted && errors.secondaryName)}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <ImagesManager images={formData.images} setImages={setImages} editable={true} maxImages={1} genderInput="f"
                            cThumbInput={TEXT.SELECT_IMAGES_ADD} labelH2=""
                            /*cThumbPrevContainer=""  cThumbPrevImg="" cThumbImgContainer="" cThumbImgBody="" cThumbImgBodyCont=""
                            cImgDisplay="" idThumbBtnAdd={""} */ />
                    </div>
                    <div className="catFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" href="/categories">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CategoriesForm;