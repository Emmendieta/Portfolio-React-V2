import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchContinentByIdPopulate, fetchCreateContinent, fetchUpdateContinentById } from "../continentsLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { fetchGetAllCountriesUnassigned } from "../../countries/countriesLogic";
import Selects from "../../generalFields/selects/selectsV1/selectsV1";;
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./continentsForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ContinentsForm() {
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
    const [countriesAvailables, setCountriesAvailables] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [assignedCountryIds, setAssignedCountryIds] = useState(new Set());
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.primaryName = error.message; };
        if (showOtherLang) { try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.secondaryName = error.message; }; };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Validate Hooks:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: "" }, countries: [] }, validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateContinentById(id, data);
                else result = await fetchCreateContinent(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.CONTINENT} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/continents");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Load Category if is Edit:
    useEffect(() => {
        const loadContinent = async () => {
            try {
                const permission = isEdit ? "update_continents": "create_continents";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const allCountriesRes = await fetchGetAllCountriesUnassigned();
                if (!allCountriesRes || !allCountriesRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                let available = allCountriesRes.response || [];
                const assignedCountries = new Set();
                //FALTAN PERMISOS PARA CREAR
                if (!isEdit) {
                    available = available.filter(country => !assignedCountries.has(country._id));
                    setCountriesAvailables(available);
                    //return;
                }
                //FALTAN PERMISOS PARA EDITAR
                else {
                    const result = await fetchContinentByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    const continent = result.response;
                    continent.countries?.forEach(country => { assignedCountries.add(country._id); });
                    setFormData(prev => ({ ...prev, _id: continent._id, name: { es: continent.name?.es || "", en: continent.name?.en || "" }, countries: continent.countries || [] }));
                    available = available.filter(country => !assignedCountries.has(country._id));
                    setCountriesAvailables(available);
                };
                setAssignedCountryIds(assignedCountries);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadContinent();
    }, [id, isEdit, user, language, verifyPrivileges]);

    const getCountryLabel = (country) => { return country.name?.[language] || country.name?.es || country.name?.en || ""; };

    const handleAddCountry = () => {
        if (!selectedCountryId) return;
        const country = countriesAvailables.find(c => c._id === selectedCountryId);
        if (!country) return;
        setFormData(prev => ({ ...prev, countries: [...prev.countries, country] }));
        setCountriesAvailables(prev => prev.filter(c => c._id !== selectedCountryId));
        setAssignedCountryIds(prev => new Set([...prev, country._id]));
        setSelectedCountryId("");
    };

    const handleRemoveCountry = (countryId) => {
        const country = formData.countries.find(c => c._id === countryId);
        if (!country) return;
        setFormData(prev => ({ ...prev, countries: prev.countries.filter(c => c._id !== countryId) }));
        setCountriesAvailables(prev => [...prev, country]);
        setAssignedCountryIds(prev => {
            const copy = new Set(prev);
            copy.delete(countryId);
            return copy;
        });
    };

    return (
        <div className="contFormCont">
            <section className="contFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.CONTINENT}:` : `${TEXT.CREATE} ${TEXT.CONTINENT}:`} language={language} />
            </section>
            <section className="contFormSectForm">
                <form id="contForm" onSubmit={handleSubmit}>
                    <div className="contFormDivCont">
                        <div className="contFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name={"name"} value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CONTINENT)}/* {TEXT.inputsText("m", `${TEXT.NAME_OF_THE_CONTINENT} (${primaryLang.toUpperCase()})`)} */
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted) && errors.primaryName} language={language}
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name={"name"} value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CONTINENT)}/* {TEXT.inputsText("m", `${TEXT.NAME_OF_THE_CONTINENT} (${secondaryLang.toUpperCase()})`)} */
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted) && errors.secondaryName} language={language}
                                className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                    </div>
                    <div className="contFormSelectCont">
                        <Selects titleAvailable={`${TEXT.COUNTRIES_AVAILABLES}:`} titleSelected={`${TEXT.COUNTRIES_ASSOCIATED}`} availableItems={countriesAvailables} selectedItems={formData.countries} valueDefault={TEXT.SELECT_A_COUNTRY} valueDefualtNo={`${TEXT.NO_COUNTRY_ASSOCIATED}!`}
                            selectedItemId={selectedCountryId} onChangeSelect={setSelectedCountryId} onAdd={handleAddCountry} onRemove={handleRemoveCountry} getLabel={getCountryLabel} language={language}
                            /* classCont={"genFormSelectContainer"} classContTitle={"genFormSelectTitle"} idH1FieldTitle={"genFormSelectH1"} classContBody={"genFormSelectBodyContainer"} classBodySelectItems={"genFormSelectSelectItemsContainer"}
                            idSelectItems={"genFormSelectItems"} classBodyList={"genFormSelectSectContainer"} classUlCont={"genFormUlContainer"} selectListUl={"genFormSelectUl"} selectListUlLi={"genFormSelectUlLi"} selectListUlH1={"genFormSelectUlH1"}
                            selectListUlLiDiv={"genFormSelectUlLiDiv"} selectListUlLiDivH2={"genormSelectUlLiDivH2"} idH1FieldTitleSelect={"genFormSelectH1TitleSelect"} */
                        />
                    </div>
                    <div className="contFormDivContBottom">
                        <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" id="btnCancel" href="/continents">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ContinentsForm;