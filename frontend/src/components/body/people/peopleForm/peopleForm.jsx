import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { fetchCreatePersonWithImages, fetchPersonByIdPopulate, fetchUpdatePersonByIdWithImages } from "../peopleLogic";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchGetAllContinentsPopulate } from "../../continents/continentsLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import SelectsV2 from "../../generalFields/selects/selectsV2/selectsV2";
import { validatorAlphaNumeric, validatorCUILCUIT, validatorDate, validatorDNI, validatorLongText, validatorName, validatorNumber, validatorPhone } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import ImageManager from "../../generalFields/imagesMananger/imagesManager";
import "./peopleForm.css";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function PeopleForm() {
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
    const [continentsList, setContinentsList] = useState([]);
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorDNI((data.dni), TEXT.ERROR_DNI_MIN_MAX); } catch (error) { errors.dni = error.message; };
        try { validatorName(data.firstName, TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.firstName = error.message; };
        try { validatorName(data.lastName, TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.lastName = error.message; };
        try { validatorCUILCUIT(data.cuil, TEXT.ERROR_CUIL_CUIT); } catch (error) { errors.cuit = error.message; };
        try {
            validatorDate(data.birthday, { allowFuture: false, maxYearsAgo: 120 }, TEXT.ERROR_DATE_EMPTY, TEXT.ERROR_DATE_FORMAT, TEXT.ERROR_DATE_INVALID, TEXT.ERROR_DATE_FUTURE, TEXT.ERROR_DATE_TOO_OLD);
        } catch (error) { errors.birthday = error.message; };
        try { validatorPhone(data.phone, TEXT.ERROR_PHONE); } catch (error) { errors.phone = error.message; };
        try { validatorName(data.jobTitle?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.jobTitlePrimary = error.message; };
        if (showOtherLang) { try { validatorName(data.jobTitle?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.jobTitleSecondary = error.message; }; };
        try { validatorAlphaNumeric(data.address?.street, TEXT.ERROR_ONLY_ALPHANUMERICS); } catch (error) {
            if (!errors.address) errors.address = {};
            errors.address.street = error.message;
        };
        try { validatorNumber(data.address?.number, TEXT.ERROR_NUMBERS_MIN); } catch (error) {
            if (!errors.address) errors.address = {};
            errors.address.number = error.message;
        };
        try { validatorNumber(data.address?.floor, TEXT.ERROR_NUMBERS_MIN); } catch (error) {
            if (!errors.address) errors.address = {};
            errors.address.floor = error.message;
        };
        try { validatorLongText(data.aboutMe?.[primaryLang], "FALTA TEXTO ERROR TEXTO LARGO"); } catch(error) { errors.aboutMePrimary = error.message; };
        if(showOtherLang) { try { validatorLongText(data.aboutMe?.[secondaryLang], "FALTA TEXTO ERROR TEXTO LARGO"); } catch(error) { error.aboutMeSecondary = error.message; }; };
        //FALTA VALIDAR CONTINENTES; COUNTRY; PROVINCE; CITY y LEGAL ADDRESS
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        {
            _id: "", firstName: "", lastName: "", dni: "", cuil: "", birthday: "", phone: "", jobTitle: { es: "", en: "" }, address: { street: "", number: "", floor: "", aparment: "", },
            legalAddress: { street: "", number: "", floor: "", aparment: "" }, images: [], continents: { _id: "", name: { es: "", en: "" }, countries: [] },
            countries: { _id: "", name: { es: "", en: "" }, provinces: [] }, provinces: { _id: "", name: { es: "", en: "" }, cities: [] },
            cities: { _id: "", name: { es: "", en: "" } }
        }, validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdatePersonByIdWithImages(id, data);
                else result = await fetchCreatePersonWithImages(data);
                if (result?.error) return errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.PERSON} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/people");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    const handleSelectChange = (level, selectedObj) => {
        try {
            setFormData(prev => {
                switch (level) {
                    case "continents":
                        return {
                            ...prev, continents: selectedObj || { _id: "", name: { es: "", en: "" }, countries: [] }, countries: { _id: "", name: { es: "", en: "" }, provinces: [] },
                            provinces: { _id: "", name: { es: "", en: "" }, cities: [] }, cities: { _id: "", name: { es: "", en: "" } }
                        };
                    case "countries":
                        return {
                            ...prev, countries: selectedObj || { _id: "", name: { es: "", en: "" }, provinces: [] }, provinces: { _id: "", name: { es: "", en: "" }, cities: [] },
                            cities: { _id: "", name: { es: "", en: "" } }
                        };
                    case "provinces":
                        return { ...prev, provinces: selectedObj || { _id: "", name: { es: "", en: "" }, cities: [] }, cities: { _id: "", name: { es: "", en: "" } } };
                    case "cities":
                        return { ...prev, cities: selectedObj || { _id: "", name: { es: "", en: "" } } };
                    default:
                        return prev;
                }
            });
        } catch (error) { console.error("Error: ", error.message); }
    };

    const filteredCountries = formData.continents?._id ? formData.continents.countries : [];
    const filteredProvinces = formData.countries?._id ? formData.countries.provinces : [];
    const filteredCities = formData.provinces?._id ? formData.provinces.cities : [];

    //cargamos person en caso de edit:
    useEffect(() => {
        const loadPerson = async () => {
            try {
                const permission = isEdit ? "update_people": "create_people";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const allContinents = await fetchGetAllContinentsPopulate();
                if (!allContinents || !allContinents.response) {
                    //FALTA EL SWEET
                    return;
                };
                const continents = allContinents.response || [];
                setContinentsList(continents);
                //FALTAN PERMISOS PARA CREAR
                if (!isEdit) { }
                //FALTAN PERMISOS PARA EDITAR:
                else {
                    const result = await fetchPersonByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    const person = result.response || [];
                    const selectedContinent = continents.find(c => c._id === person?.continents?._id) || { _id: "", name: { es: "", en: "" }, countries: [] };
                    const selectedCountry = selectedContinent?.countries.find(c => c._id === person?.countries?._id) || { _id: "", name: { es: "", en: "" }, provinces: [] };
                    const selectedProvince = selectedCountry?.provinces.find(p => p._id === person?.provinces?._id) || { _id: "", name: { es: "", en: "" }, cities: [] };
                    const selectedCity = selectedProvince?.cities.find(ci => ci._id === person?.cities?._id) || { _id: "", name: { es: "", en: "" } };
                    setFormData(prev => ({
                        ...prev, _id: person._id, firstName: person.firstName, lastName: person.lastName, dni: person.dni, cuil: person.cuil, birthday: person.birthday,
                        phone: person.phone, jobTitle: { es: person.jobTitle?.es || "", en: person.jobTitle?.en || "" },
                        address: { street: person.address?.street || "", number: person.address?.number || "", floor: person.address?.floor || "", aparment: person.address?.aparment || "" },
                        legalAddress: { street: person.legalAddress?.street, number: person.legalAddress?.number, floor: person.legalAddress?.floor, aparment: person.legalAddress?.aparment }, images: person.images?.length ?
                            person.images.map(img => ({ publicId: img.publicId, url: img.url, hash: img.hash, width: img.width, height: img.height, isMain: img.isMain || false, })) : [],
                        continents: selectedContinent || { _id: "", name: { es: "", en: "" }, countries: [] }, countries: selectedCountry || { _id: "", name: { es: "", en: "" }, provinces: [] },
                        provinces: selectedProvince || { _id: "", name: { es: "", en: "" }, cities: [] }, cities: selectedCity || { _id: "", name: { es: "", en: "" } }
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
        loadPerson();
    }, [id, isEdit, user, language, verifyPrivileges]);

    const setImages = (newImages) => setFormData(prev => ({ ...prev, images: newImages }));

    return (
        <div className="peoFormCont">
            <section className="peoFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.PERSON}:` : `${TEXT.CREATE} ${TEXT.PERSON}:`} language={language} />
            </section>
            <section className="peoFormSectForm">
                <form id="peoForm" onSubmit={handleSubmit}>
                    <div className="peoFormDivCont">
                        <div className="peoFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true} className={"formInputRow"} cNContainer={"formInputRowContainter"} cNSecTop={"formInputRowTop"} cNSectBottom={"forInputRowBottom"} />
                        )}
                        <Inputs textH2={TEXT.DNI} type="number" name={"dni"} value={formData.dni} placeHolder={TEXT.inputsText("m", TEXT.DNI)}/*{TEXT.inputsText("m", TEXT.DNI_OF_THE_USER)}*/ language={language} onChange={handleChange}
                            onBlur={handleBlur} error={(touched.dni || isSubmitted) && errors.dni}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.FIRST_NAME} type="text" name={"firstName"} value={formData.firstName} placeHolder={TEXT.inputsText("m", TEXT.FIRST_NAME)}/*{TEXT.inputsText("m", TEXT.FIRST_NAME_OF_THE_PERSON)}*/ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.firstName || isSubmitted) && errors.firstName} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.LAST_NAME} type="text" name={"lastName"} value={formData.lastName} placeHolder={TEXT.inputsText("m", TEXT.LAST_NAME)}/*{TEXT.inputsText("m", TEXT.LAST_NAME_OF_THE_PERSON)}*/ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.lastName || isSubmitted) && errors.lastName} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.CUIL} type="number" name={"cuil"} value={formData.cuil} placeHolder={TEXT.inputsText("m", TEXT.CUIL)}/*{TEXT.inputsText("m", TEXT.CUIL_OF_THE_PERSON)}*/ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.cuil || isSubmitted) && errors.cuil} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.BIRTHDAY} type="date" name={"birthday"} value={formData.birthday ? formData.birthday.slice(0, 10) : ""} placeholder={TEXT.inputsText("m", TEXT.BIRTHDAY)}/*{TEXT.inputsText("m", TEXT.BIRTHDAY_OF_THE_PERSON)}*/ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.birthday || isSubmitted) && errors.birthday} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.PHONE} type="number" name={"phone"} value={formData.phone} placeHolder={TEXT.inputsText("m", TEXT.PHONE)}/*{TEXT.inputsText("m", TEXT.PHONE_OF_THE_PERSON)}*/ onChange={handleChange} onBlur={handleBlur}
                            error={(touched.phone || isSubmitted) && errors.phone} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={`${TEXT.JOB_TITLE} (${primaryLang.toUpperCase()})`} type="text" name={`jobTitle`} value={formData.jobTitle?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}/*{TEXT.inputsText("m", `${TEXT.JOB_TITLE_OF_THE_PERSON} (${primaryLang.toUpperCase()})`)}*/
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`jobTitle_${primaryLang}`] || isSubmitted) && errors.jobTitlePrimary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.JOB_TITLE} (${secondaryLang.toUpperCase()})`} type="text" name={`jobTitle`} value={formData.jobTitle?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}/*{TEXT.inputsText("m", `${TEXT.JOB_TITLE_OF_THE_PERSON} (${secondaryLang.toUpperCase()})`)}*/
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`jobTitle_${secondaryLang}`] || isSubmitted) && errors.jobTitleSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <H2Fields value={`${TEXT.PERSONAL_ADDRESS}:`} language={language} className="genFormH2TitleCont" classNameH2="genFormH2TextTitle" />
                        <Inputs textH2={TEXT.STREET_ADDRESS} type="text" name={"address.street"} value={formData.address?.street} placeHolder={TEXT.inputsText("f", TEXT.STREET_ADDRESS)}/*{TEXT.inputsText("m", TEXT.STREET_ADDRESS_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["address.street"] || isSubmitted) && errors.address?.street} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.NUMBER} type="number" name={"address.number"} value={formData.address?.number} placeHolder={TEXT.inputsText("m", TEXT.NUMBER)}/*{TEXT.inputsText("m", TEXT.STREET_NUMBER_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["address.number"] || isSubmitted) && errors.address?.number} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.FLOOR} type="number" name={"address.floor"} value={formData.address?.floor} placeHolder={TEXT.inputsText("m", TEXT.FLOOR)}/*{TEXT.inputsText("m", TEXT.FLOOR_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["address.floor"] || isSubmitted) && errors.address?.floor} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.APARMENT} type="text" name={"address.aparment"} value={formData.address?.aparment} placeHolder={TEXT.inputsText("m", TEXT.APARMENT)}/*{TEXT.inputsText("m", TEXT.APARMENT_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <H2Fields value={`${TEXT.LEGAL_ADDRESS}:`} language={language} className="genFormH2TitleCont" classNameH2="genFormH2TextTitle" />
                        <Inputs textH2={TEXT.STREET_ADDRESS} type="text" name={"legalAddress.street"} value={formData.legalAddress?.street} placeHolder={TEXT.inputsText("f", TEXT.STREET_ADDRESS)}/*{TEXT.inputsText("m", TEXT.STREET_ADDRESS_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["legalAddress.street"] || isSubmitted) && errors.legalAddress?.street} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.NUMBER} type="number" name={"legalAddress.number"} value={formData.legalAddress?.number} placeHolder={TEXT.inputsText("m", TEXT.NUMBER)}/*{TEXT.inputsText("m", TEXT.STREET_NUMBER_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["legalAddress.number"] || isSubmitted) && errors.legalAddress?.number} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.FLOOR} type="number" name={"legalAddress.floor"} value={formData.legalAddress?.floor} placeHolder={TEXT.inputsText("m", TEXT.FLOOR)}/*{TEXT.inputsText("m", TEXT.FLOOR_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} error={(touched["legalAddress.floor"] || isSubmitted) && errors.legalAddress?.floor} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.APARMENT} type="text" name={"legalAddress.aparment"} value={formData.legalAddress?.aparment} placeHolder={TEXT.inputsText("m", TEXT.APARMENT)}/*{TEXT.inputsText("m", TEXT.APARMENT_OF_THE_PERSON)}*/
                            onChange={handleChange} onBlur={handleBlur} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={`${TEXT.ABOUT_ME} (${primaryLang.toUpperCase()})`} type="text" name={"aboutMe"} value={formData.aboutMe?.[primaryLang] || ""} placeHolder={TEXT.inputsText("no", TEXT.ABOUT_ME)}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`aboutMe_${primaryLang}`] || isSubmitted) && errors.aboutMePrimary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.ABOUT_ME} (${secondaryLang.toUpperCase()})`} type="text" name={"aboutMe"} value={formData.aboutMe?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("no", TEXT.ABOUT_ME)}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`aboutMe_${secondaryLang}`] || isSubmitted) && errors.aboutMeSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                    </div>
                    <div className="peoFormSelectCont">
                        <SelectsV2 label={`${TEXT.CONTINENT}:`} options={continentsList} value={formData.continents._id || ""} placeholder={TEXT.SELECT_CONTINENT} language={language} placeholder={TEXT.SELECT_OPTION}
                            onChange={(e) => handleSelectChange("continents", continentsList.find(c => c._id === e.target.value))}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont"

                        />
                        <SelectsV2 label={`${TEXT.COUNTRY}:`} options={filteredCountries} value={formData.countries._id || ""} placeholder={TEXT.SELECT_COUNTRY} language={language} placeholder={TEXT.SELECT_OPTION}
                            disabled={!formData.continents._id} onChange={(e) => handleSelectChange("countries", filteredCountries.find(c => c._id === e.target.value))}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont"
                        />
                        <SelectsV2 label={`${TEXT.PROVINCE}:`} options={filteredProvinces} value={formData.provinces._id || ""} placeholder={TEXT.SELECT_PROVINCE} language={language} placeholder={TEXT.SELECT_OPTION}
                            disabled={!formData.countries._id} onChange={(e) => handleSelectChange("provinces", filteredProvinces.find(p => p._id === e.target.value))}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont"
                        />
                        <SelectsV2 label={`${TEXT.CITY}:`} options={filteredCities} value={formData.cities._id || ""} placeholder={TEXT.SELECT_CITY} language={language} placeholder={TEXT.SELECT_OPTION}
                            disabled={!formData.provinces._id} onChange={(e) => handleSelectChange("cities", filteredCities.find(c => c._id === e.target.value))}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont"
                        />
                    </div>
                    <div className="peoFormImgCont">
                        <ImageManager images={formData.images} setImages={setImages} editable={true} extInput={TEXT.IMAGES} genderInput={"f"} cThumbInput={TEXT.SELECT_IMAGES_ADD}
                            /* cThumbCont={"thumbnailsContainerDetails"} cThumbAddCont={"thumbnailsAddContainerDetails"} 
                            cThumbPrevContainer={"thumnailsPreviewImgContainerDetails"} labelH2={""} valueH2={""} cThumbPrevImg={"thumbnailsImgPreviewDetails"}
                            cThumbImgContainer={"thumbnailsImgsContainerDetails"} cThumbImgBody={"thumbnailsImgBodyDetails"} cThumbImgBodyCont={"thumbnailsImgBodyContainerDetails"}
                            cImgDisplay={"thumbnailImageDisplayDetails"} idThumbBtnAdd={"thumbnailsImageBtnAdd"} */ />
                    </div>
                    <div className="peoFormDivContBottom">
                        <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                        <a className="btn btn-outline-danger" id="btnCancel" href="/people">{TEXT.CANCEL}</a>
                        <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default PeopleForm;