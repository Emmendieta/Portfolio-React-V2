import { useContext, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLoading } from "../../../../context/Loading.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { validatorName } from "../../../../helpers/validators.helper";
import { fetchCreateManyCategories } from "../categoriesLogic";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import "./categoriesManyForm.css";

function CategoriesManyForm() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet, successSweet } = useSweetAlert();
    const { verifyPrivileges } = userVerifyPrivileges();
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const [categories, setCategories] = useState([{
        name: { es: "", en: "" }
    }
    ]);
    const [errors, setErrors] = useState([]);

    // Change name
    const handleChange = (index, lang, value) => {
        setCategories(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], name: { ...updated[index].name, [lang]: value } };
            return updated;
        });

        // Remove error while typing
        setErrors(prev => {
            const updated = [...prev];
            if (updated[index]) {
                updated[index] = { ...updated[index], [lang]: undefined };
            }
            return updated;
        });
    };

    // Add category
    const addCategory = () => {
        setCategories(prev => [...prev, { name: { es: "", en: "" } }]);
    };

    //Move Category Up:
    const moveCategoryUp = (index) => {
        if (index === 0) return;
        setCategories(prev => {
            const updated = [...prev];
            [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
            return updated;
        });
    };

    //Move Category Down:
    const moveCategoryDown = (index) => {
        if (index === categories.length - 1) return;
        setCategories(prev => {
            const updated = [...prev];
            [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
            return updated;
        });
    };

    //Remove category
    const removeCategory = (index) => {
        if (categories.length === 1) return;
        setCategories(prev => prev.filter((_, i) => i !== index));
        setErrors(prev => prev.filter((_, i) => i !== index) );
    };

    // Validate
    const validateCategories = () => {
        const validationErrors = categories.map(category => {
            const categoryErrors = {};
            try { validatorName(category.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { categoryErrors[primaryLang] = error.message; };
            try { validatorName(category.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { categoryErrors[secondaryLang] = error.message; };
            return categoryErrors;
        });

        // Check duplicated names inside the request
        const names = categories.map(category => category.name?.es?.trim().toLowerCase());
        names.forEach((name, index) => {
            if (!name) return;
            const duplicated = names.some((otherName, otherIndex) => index !== otherIndex && name === otherName);
            if (duplicated) { validationErrors[index].es = "This category name is duplicated!"; }
        });
        setErrors(validationErrors);
        return validationErrors.every(error => Object.keys(error).length === 0);
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            /*const allowed = await verifyPrivileges( user, "create_categories" );
            if (!allowed) return;*/
            const valid = validateCategories();
            if (!valid) return;
            startLoading();
            const dataToCreate = categories.map((category, index) => ({ ...category, order: index + 1 }));
            const result = await fetchCreateManyCategories(dataToCreate);
            if (result?.error) { throw new Error(result.error.message); }
            await successSweet(`${TEXT.CATEGORY} ${TEXT.CREATE_SUCCESS}`);
            navigate("/categories");
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}`);
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="catManyFormCont">
            <section className="catManyFormSectTitle">
                <H1Fields value={`${TEXT.CREATE} ${TEXT.CATEGORY}:`} language={language} />
            </section>
            <section className="catManyFormSectForm">
                <form id="catManyForm" onSubmit={handleSubmit} >
                    <div className="catManyRows">
                        {categories.map((category, index) => (
                            <div className="catManyRow" key={index} >
                                <div className="catManyIndex">
                                    {index + 1}
                                </div>
                                <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name={`name_${primaryLang}_${index}`} value={category.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CATEGORY)}
                                    onChange={(e) => handleChange(index, primaryLang, e.target.value)} error={errors[index]?.[primaryLang]}
                                    className="genFormInput" cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                                <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name={`name_${secondaryLang}_${index}`} value={category.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CATEGORY)}
                                    onChange={(e) => handleChange(index, secondaryLang, e.target.value)} error={errors[index]?.[secondaryLang]}
                                    className="genFormInput" cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                                <button type="button" className="btn btn-outline-primary" onClick={() => moveCategoryUp(index)} disabled={index === 0} title="FALTA TEXTO MOVE CATEGORY UP">↑</button>
                                <button type="button" className="btn btn-outline-primary" onClick={() => moveCategoryDown(index)} disabled={index === categories.length - 1} title="FALTA TEXTO MOVE CATEGORY DOWN">↓</button>
                                <button type="button" className="btn btn-outline-danger catManyDeleteBtn" onClick={() => removeCategory(index)} disabled={categories.length === 1} >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="catManyAddCont">
                        <button type="button" className="btn btn-outline-primary" onClick={addCategory} > + {TEXT.CREATE} {TEXT.CATEGORY} </button>
                    </div>
                    <div className="catFormDivContBottom">
                        <a className="btn btn-outline-primary" href="/" >{TEXT.HOME} </a>
                        <a className="btn btn-outline-danger" href="/categories" >{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" > {TEXT.CREATE} </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CategoriesManyForm;