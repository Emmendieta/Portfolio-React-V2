import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreateProvince, fetchUpdateProvinceById, fethProvinceByIdPopulate } from "../provincesLogic";
import { fetchGetAllCitiesUnassigned } from "../../cities/citiesLogic";
import SelectsV1 from "../../generalFields/selects/selectsV1/selectsV1";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./provincesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ProvincesForm() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();
    const isEdit = id && id !== "new";
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const [showOtherLang, setShowOtherLang] = useState(false);
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const [citiesAvailable, setCitiesAvailable] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState("");
    const [assignedCitiesIds, setAssignedCitiesIds] = useState(new Set());
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.namePrimary = error.message; };
        if (showOtherLang) { try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.nameSecondary = error.message; }; };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: "" }, cities: [] }, validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateProvinceById(id, data);
                else result = await fetchCreateProvince(data);
                if (result?.error) return await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.PROVINCE} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/provinces");
            } catch (error) {
                console.error("Error: ", error.message);
                await errorSweet(error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Cargar provinces si es edit:
    useEffect(() => {
        const loadProvince = async () => {
            try {
                const permission = isEdit ? "update_provinces": "create_provinces";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const allCitiesRes = await fetchGetAllCitiesUnassigned();
                if (!allCitiesRes || !allCitiesRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                let available = allCitiesRes.response || [];
                const assignedCities = new Set();
                if (!isEdit) {
                    available = available.filter(city => !assignedCities.has(city._id));
                    setCitiesAvailable(available);
                    return;
                } else {
                    const result = await fethProvinceByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const province = result.response || [];
                    province.cities?.forEach((city) => { assignedCitiesIds.add(city._id) });
                    setFormData(prev => ({ ...prev, _id: province._id, name: { es: province.name?.es || "", en: province.name?.en || "" }, cities: province.cities || [] }));
                    available = available.filter(city => !assignedCities.has(city._id));
                    setCitiesAvailable(available);
                };
                setAssignedCitiesIds(assignedCities);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProvince();
    }, [id, isEdit, user, language]);

    const getCityLabel = (city) => {
        return city.name?.[language] || city.name?.es || city.name?.en || "";
    };

    const handleAddCity = async () => {
        try {
            if (!selectedCityId) return;
            const city = citiesAvailable.find(c => c._id === selectedCityId);
            if (!city) return;
            setFormData(prev => ({ ...prev, cities: [...prev.cities, city] }));
            setCitiesAvailable(prev => prev.filter(c => c._id !== selectedCityId));
            setAssignedCitiesIds(prev => new Set([...prev, city._id]));
            setSelectedCityId("");
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        }
    };

    const handleRemoveCity = async (cityId) => {
        try {
            const city = formData.cities.find(c => c._id === cityId);
            if (!city) return;
            setFormData(prev => ({ ...prev, cities: prev.cities.filter(c => c._id !== cityId) }));
            setCitiesAvailable(prev => [...prev, city]);
            setAssignedCitiesIds(prev => {
                const copy = new Set(prev);
                copy.delete(cityId);
                return copy;
            });
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        }
    };

    return (
        <div className="proFormCont">
            <section className="proFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.PROVINCE}:` : `${TEXT.CREATE} ${TEXT.PROVINCE}:`} language={language} />
            </section>
            <section className="proFormSectForm">
                <form id="proForm" onSubmit={handleSubmit}>
                    <div className="proFormDivCont">
                        <div className="proFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true} 
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name={"name"} placeHolder={TEXT.inputsText("m", TEXT.NAME)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PROVINCE)} */ value={formData.name?.[primaryLang] || ""}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}`] || isSubmitted) && errors.namePrimary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} (${secondaryLang.toUpperCase()})`} type="text" name={"name"} placeHolder={TEXT.inputsText("m", TEXT.NAME)}//* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PROVINCE)} */ value={formData.name?.[secondaryLang] || ""}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}`] || isSubmitted) && errors.nameSecondary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                    </div>
                    <div className="proFormSelectCont">
                        <SelectsV1 titleAvailable={`${TEXT.CITIES_AVAILABLES}:`} titleSelected={`${TEXT.CITIES_ASSOCIATED}`} availableItems={citiesAvailable} selectedItems={formData.cities} valueDefault={TEXT.SELECT_A_CITY} valueDefualtNo={`${TEXT.NO_CITIES_ASSOCIATED}!`}
                            selectedItemId={selectedCityId} onChangeSelect={setSelectedCityId} onAdd={handleAddCity} onRemove={handleRemoveCity} getLabel={getCityLabel} language={language}
                            /* cclassCont={"genFormSelectContainer"} classContTitle={"genFormSelectTitle"} idH1FieldTitle={"genFormSelectH1"} classContBody={"genFormSelectBodyContainer"} classBodySelectItems={"genFormSelectSelectItemsContainer"}
                            idSelectItems={"genFormSelectItems"} classBodyList={"genFormSelectSectContainer"} classUlCont={"genFormUlContainer"} selectListUl={"genFormSelectUl"} selectListUlLi={"genFormSelectUlLi"} selectListUlH1={"genFormSelectUlH1"}
                            selectListUlLiDiv={"genFormSelectUlLiDiv"} selectListUlLiDivH2={"genormSelectUlLiDivH2"} idH1FieldTitleSelect={"genFormSelectH1TitleSelect"} */
                        />
                    </div>
                    <div className="proFormDivContBottom">
                        <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" id="btnCancel" href="/provinces">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ProvincesForm;