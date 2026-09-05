import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLoading } from "../../../../context/Loading.Context";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchUpdateCountryById, fetchCreateCountry, fetchCountryByIdPopulate } from "../countriesLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { fetchGetAllProvincesUnassigned } from "../../provinces/provincesLogic";
import Selects from "../../generalFields/selects/selectsV1/selectsV1";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./countriesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function CountriesForm() {
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
    const [provincesAvailables, setProvincesAvailables] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [assignedProvinceIds, setAssignedProvinceIds] = useState(new Set());
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.name?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.primaryName = error.message; };
        if(showOtherLang) {
            try { validatorName(data.name?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.secondaryName = error.message; };
        };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", name: { es: "", en: ""}, provinces: [] },
        validate,
        async (data) => {
            try {
                setLoading(true);
                startLoading();
                let result;
                if(isEdit) result = await fetchUpdateCountryById(id, data);
                else result = await fetchCreateCountry(data);
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.COUNTRY} ${isEdit ? TEXT.UPDATE_SUCCESS: TEXT.CREATE_SUCCESS}`);
                navigate("/countries");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Cargar country si es Edit:
    useEffect(() => {
        const loadCountry = async () => {
            try {
                const permission = isEdit ? "update_countries": "create_countries";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const allProvincesRes = await fetchGetAllProvincesUnassigned();
                if(!allProvincesRes || !allProvincesRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                let available = allProvincesRes.response || [];
                const assignedProvinces = new Set();
                if(!isEdit) {
                    available = available.filter(province => !assignedProvinces.has(province._id));
                    setProvincesAvailables(available);
                }
                else {
                    const result = await fetchCountryByIdPopulate(id);
                    if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    const country = result.response || [];
                    country.provinces?.forEach(province => { assignedProvinces.add(province._id); });
                    setFormData(prev => ({ ...prev, _id: country._id, name: { es: country.name?.es || "", en: country.name?.en || ""}, provinces: country.provinces || [] }));
                    available = available.filter(province => !assignedProvinces.has(province._id));
                    setProvincesAvailables(available);
                };
                setAssignedProvinceIds(assignedProvinces);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCountry();
    }, [id, isEdit, user, language, verifyPrivileges]);

    const getProvinceLabel = (province) => {
        return province.name?.[language] || province.name?.es || province.name?.en || "";
    };

    const handleAddProvince = async () => {
        try {
            if(!selectedProvinceId) return;
            const province = provincesAvailables.find(pro => pro._id == selectedProvinceId);
            if(!province) return;
            setFormData(prev => ({ ...prev, provinces: [...prev.provinces, province]}));
            setProvincesAvailables(prev => prev.filter(pro => pro._id !== selectedProvinceId));
            setAssignedProvinceIds(new Set([...assignedProvinceIds, province._id]));
            setSelectedProvinceId("");
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        }
    };

    const handleReomveProvince = async (provinceId) => {
        try {
            const province = formData.provinces.find(pro => pro._id === provinceId);
            if(!province) return;
            setFormData(prev => ({ ...prev, provinces: prev.provinces.filter(pro => pro._id !== provinceId)}));
            setProvincesAvailables(prev => [...prev, province]);
            setAssignedProvinceIds(prev => {
                const copy = new Set(prev);
                copy.delete(provinceId);
                return copy;
            });
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            console.error(`${TEXT.ERROR}: ${error.message}`);
        }
    };

    return (
        <div className="counFormCont">
            <section className="counFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.COUNTRY}:` : `${TEXT.CREATE} ${TEXT.COUNTRY}:`} language={language} />
            </section>
            <section className="counFormSectForm">
                <form id="countForm" onSubmit={handleSubmit}>
                    <div className="counFormDivCont">
                        <div className="counFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true} 
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                        <Inputs textH2={`${TEXT.NAME} (${primaryLang.toUpperCase()})`} type="text" name={"name"} value={formData.name?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_COUNTRY)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_COUNTRY)} */ 
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`name_${primaryLang}` || isSubmitted]) && errors.primaryName} 
                            className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME}  (${secondaryLang.toUpperCase()})`} type="text" name={"name"} value={formData.name?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_COUNTRY)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_COUNTRY)} */ 
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`name_${secondaryLang}` || isSubmitted] && errors.secondaryName)} 
                                className={"genFormInput"} cNContainer={"genFormInputCont"} cNSecTop={"genFormInputTopCont"} cNSectBottom={"genFormInputBottomCont"} />
                        )}
                    </div>
                    <div className="counFormSelectCont">
                            <Selects titleAvailable={TEXT.PROVINCES_AVAILABLES} titleSelected={TEXT.PROVINCES_ASSOCIATED} availableItems={provincesAvailables} selectedItems={formData.provinces} valueDefault={TEXT.SELECT_A_PROVINCE} valueDefualtNo={`${TEXT.NO_PROVINCE_ASSOCIATED}!`}
                                selectedItemId={selectedProvinceId} onChangeSelect={setSelectedProvinceId} onAdd={handleAddProvince} onRemove={handleReomveProvince} getLabel={getProvinceLabel} language={language} 
                                /* classCont={"generalFormSelectContainer"} classContTitle={"generalFormSelectTitle"} idH1FieldTitle={"generalFormSelectH1"} classContBody={"generalFormSelectBodyContainer"} classBodySelectItems={"generalFormSelectSelectItemsContainer"} 
                                idSelectItems={"generalFormSelectItems"} classBodyList={"generalFormSelectSectContainer"} classUlCont={"generalFormUlContainer"} selectListUl={"generalFormSelectUl"} selectListUlLi={"generalFormSelectUlLi"} selectListUlH1={"generalFormSelectUlH1"}
                                selectListUlLiDiv={"generalFormSelectUlLiDiv"} selectListUlLiDivH2={"generalFormSelectUlLiDivH2"} idH1FieldTitleSelect={"generalFormSelectH1TitleSelect"} */
                            /> 
                    </div>
                    <div className="counFormDivContBottom">
                        <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" id="btnCancel" href="/countries">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{ isEdit ? TEXT.UPDATE : TEXT.CREATE }</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CountriesForm;