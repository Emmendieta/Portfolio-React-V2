import { useState } from "react";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import Inputs from "../../generalFields/Inputs/inputs";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import SelectsV2 from "../../generalFields/selects/selectsV2/selectsV2";
import ImageManager from "../../generalFields/imagesMananger/imagesManager";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import "./personFields.css";

const EMPTY_LOCATION = { _id: "", name: { es: "", en: "" } };

function PersonFields({ data, setFormData, handleChange, handleBlur, errors, touched, isSubmitted, list = [], language, isEdit }) {
    const TEXT = LANG_CONST[language];
    const [showOtherLang, setShowOtherLang] = useState(false);
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const continentsList = list;
    const countriesList = data.continents?._id ? continentsList.find(c => c._id === data.continents._id)?.countries || [] : [];
    const provincesList = data.countries?._id ? countriesList.find(c => c._id === data.countries._id)?.provinces || [] : [];
    const citiesList = data.provinces?._id ? provincesList.find(p => p._id === data.provinces._id)?.cities || [] : [];
    const setImages = (newImages) => setFormData(prev => ({ ...prev, person: { ...prev.person, images: newImages } }));

    const handleSelectChange = (level, selectedObj) => {
        setFormData(prev => {
            if (!prev) return prev;
            switch (level) {
                case "continents":
                    return {
                        ...prev, person: {
                            ...prev.person, continents: selectedObj || EMPTY_LOCATION, countries: { ...EMPTY_LOCATION, provinces: [] },
                            provinces: { ...EMPTY_LOCATION, cities: [] }, cities: EMPTY_LOCATION
                        }
                    };
                case "countries":
                    return {
                        ...prev, person: {
                            ...prev.person, countries: selectedObj || EMPTY_LOCATION, provinces: { ...EMPTY_LOCATION, cities: [] },
                            cities: EMPTY_LOCATION
                        }
                    };
                case "provinces":
                    return { ...prev, person: { ...prev.person, provinces: selectedObj || EMPTY_LOCATION, cities: EMPTY_LOCATION } };
                case "cities":
                    return { ...prev, person: { ...prev.person, cities: selectedObj || EMPTY_LOCATION } };
                default:
                    return prev;
            }
        });
    };

    return (
        <>
            <section className="perFieldSectTop">
                <H1Fields value={`${TEXT.PERSON}:`} language={language} />
            </section>
            <section className="perFieldSectForm">
                <div className="perFieldBody">
                    <div id="perFieldCheckCont">
                        <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                    </div>
                    {isEdit && (
                        <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={data._id} language={language} disabled={true} readOnly={true}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    )}
                    <Inputs textH2={TEXT.DNI} type="number" name={"person.dni"} value={data.dni} placeHolder={TEXT.inputsText("m", TEXT.DNI)}/* {TEXT.inputsText("m", TEXT.DNI_OF_THE_USER)} */ language={language} onChange={handleChange}
                        onBlur={handleBlur} error={(touched[`person.dni`] || isSubmitted) && errors.person?.dni}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.FIRST_NAME} type="text" name={"person.firstName"} value={data.firstName} placeHolder={TEXT.inputsText("m", TEXT.FIRST_NAME)}/* {TEXT.inputsText("m", TEXT.FIRST_NAME_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.firstName`] || isSubmitted) && errors.person?.firstName}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.LAST_NAME} type="text" name={"person.lastName"} value={data.lastName} placeHolder={TEXT.inputsText("m", TEXT.LAST_NAME)}/* {TEXT.inputsText("m", TEXT.LAST_NAME_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.lastName`] || isSubmitted) && errors.person?.lastName}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.CUIL} type="number" name={"person.cuil"} value={data.cuil} placeHolder={TEXT.inputsText("m", TEXT.CUIL)}/* {TEXT.inputsText("m", TEXT.CUIL_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} error={(touched[`person.cuil`] || isSubmitted) && errors.person?.cuil} disabled={true} readOnly={true}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.BIRTHDAY} type="date" name={"person.birthday"} value={data.birthday ? data.birthday.slice(0, 10) : ""} placeHolder={TEXT.inputsText("m", TEXT.BIRTHDAY)} language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.birthday`] || isSubmitted) && errors.person?.birthday}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.PHONE} type="number" name={"person.phone"} value={data.phone} placeHolder={TEXT.inputsText("m", TEXT.PHONE)}/* {TEXT.inputsText("m", TEXT.PHONE_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.phone`] || isSubmitted) && errors.person?.phone}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={`${TEXT.JOB_TITLE} (${primaryLang.toUpperCase()})`} type="text" name={"person.jobTitle"} value={data.jobTitle?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}/* {TEXT.inputsText("m", `${TEXT.JOB_TITLE_OF_THE_PERSON}  (${primaryLang.toUpperCase()})`)}*/ language={language}
                        onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`person.jobTitle_${primaryLang}`] || isSubmitted) && errors.person?.jobTitlePrimary}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    {showOtherLang && (
                        <Inputs textH2={`${TEXT.JOB_TITLE} (${secondaryLang.toUpperCase()})`} type="text" name={"person.jobTitle"} value={data.jobTitle?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.JOB_TITLE)}/* {TEXT.inputsText("m", `${TEXT.JOB_TITLE_OF_THE_PERSON} (${secondaryLang.toUpperCase()})`)} */ language={language}
                            onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`person.jobTitle_${secondaryLang}`] || isSubmitted) && errors.person?.jobTitleSecondary}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    )}
                    <Inputs textH2={`${TEXT.ABOUT_ME} (${primaryLang.toUpperCase()})`} type="text" name={"person.aboutMe"} value={data.aboutMe?.[primaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.ABOUT_ME)}
                        onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`person.aboutMe_${primaryLang}`] || isSubmitted) && errors.person?.aboutMePrimary}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    {showOtherLang && (
                        <Inputs textH2={`${TEXT.ABOUT_ME} (${secondaryLang.toUpperCase()})`} type="text" name={"person.aboutMe"} value={data.aboutMe?.[secondaryLang] || ""} placeHolder={TEXT.inputsText("m", TEXT.ABOUT_ME)}
                            onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`person.aboutMe_${secondaryLang}`] || isSubmitted) && errors.person?.aboutMeSecondary }
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    )}
                    <H2Fields value={`${TEXT.PERSONAL_ADDRESS}:`} language={language} className="genFormH2TitleCont" classNameH2="genFormH2TextTitle" />
                    <Inputs textH2={TEXT.STREET_ADDRESS} type="text" name={"person.address.street"} value={data.address?.street} placeHolder={TEXT.inputsText("f", TEXT.STREET_ADDRESS)}/* {TEXT.inputsText("m", TEXT.STREET_ADDRESS_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.address.street`] || isSubmitted) && errors.address?.street}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.NUMBER} type="number" name={"person.address.number"} value={data.address?.number} placeHolder={TEXT.inputsText("m", TEXT.NUMBER)}/* {TEXT.inputsText("m", TEXT.STREET_NUMBER_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.address.number`] || isSubmitted) && errors.address?.number}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.FLOOR} type="number" name={"person.address.floor"} value={data.address?.floor} placeHolder={TEXT.inputsText("m", TEXT.FLOOR)}/* {TEXT.inputsText("m", TEXT.FLOOR_OF_THE_PERSON)} */ language={language} onChange={handleChange}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.APARMENT} type="text" name={"person.address.aparment"} value={data.address?.aparment} placeHolder={TEXT.inputsText("m", TEXT.APARMENT)}/* {TEXT.inputsText("m", TEXT.APARMENT_OF_THE_PERSON)} */ language={language} onChange={handleChange}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <H2Fields value={`${TEXT.LEGAL_ADDRESS}:`} language={language} className="genFormH2TitleCont" classNameH2="genFormH2TextTitle" />
                    <Inputs textH2={TEXT.STREET_ADDRESS} type="text" name={"person.legalAddress.street"} value={data.legalAddress?.street} placeHolder={TEXT.inputsText("f", TEXT.STREET_ADDRESS)}/* {TEXT.inputsText("m", TEXT.STREET_ADDRESS_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.legalAddress.street`] || isSubmitted) && errors.addrlegalAddressess?.street}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.NUMBER} type="number" name={"person.legalAddress.number"} value={data.legalAddress?.number} placeHolder={TEXT.inputsText("m", TEXT.NUMBER)}/* {TEXT.inputsText("m", TEXT.STREET_NUMBER_OF_THE_PERSON)} */ language={language}
                        onChange={handleChange} onBlur={handleBlur} error={(touched[`person.legalAddress.number`] || isSubmitted) && errors.legalAddress?.number}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.FLOOR} type="number" name={"person.legalAddress.floor"} value={data.legalAddress?.floor} placeHolder={TEXT.inputsText("m", TEXT.FLOOR)}/* {TEXT.inputsText("m", TEXT.FLOOR_OF_THE_PERSON)} */ language={language} onChange={handleChange}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    <Inputs textH2={TEXT.APARMENT} type="text" name={"person.legalAddress.aparment"} value={data.legalAddress?.aparment} placeHolder={TEXT.inputsText("m", TEXT.APARMENT)}/* {TEXT.inputsText("m", TEXT.APARMENT_OF_THE_PERSON)} */ language={language} onChange={handleChange}
                        className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                </div>
                <div className="perFieldSelectCont">
                    <SelectsV2 label={`${TEXT.CONTINENT}:`} options={continentsList} value={data.continents?._id || ""} placeholder={TEXT.SELECT_A_CONTINENT} language={language}
                        onChange={(e) => handleSelectChange("continents", continentsList.find(c => c._id === e.target.value))} clGenSelCont="generalFormSelectGenContainer" clGenSelLabel="generalFormSelectGenLabel" clGenSelSelect="generalFormSelectSGenelect" clGenSelOpt="generalFormSelectGenOption"
                    />
                    <SelectsV2 label={`${TEXT.COUNTRY}:`} options={countriesList} value={data.countries?._id || ""} placeholder={TEXT.SELECT_A_COUNTRY} language={language}
                        disabled={!data.continents._id} onChange={(e) => handleSelectChange("countries", countriesList.find(c => c._id === e.target.value))} clGenSelCont="generalFormSelectGenContainer" clGenSelLabel="generalFormSelectGenLabel" clGenSelSelect="generalFormSelectSGenelect" clGenSelOpt="generalFormSelectGenOption"
                    />
                    <SelectsV2 label={`${TEXT.PROVINCE}:`} options={provincesList} value={data.provinces?._id || ""} placeholder={TEXT.SELECT_A_PROVINCE} language={language}
                        disabled={!data.countries._id} onChange={(e) => handleSelectChange("provinces", provincesList.find(p => p._id === e.target.value))} clGenSelCont="generalFormSelectGenContainer" clGenSelLabel="generalFormSelectGenLabel" clGenSelSelect="generalFormSelectSGenelect" clGenSelOpt="generalFormSelectGenOption"
                    />
                    <SelectsV2 label={`${TEXT.CITY}:`} options={citiesList} value={data.cities?._id || ""} placeholder={TEXT.SELECT_A_CITY} language={language}
                        disabled={!data.provinces._id} onChange={(e) => handleSelectChange("cities", citiesList.find(c => c._id === e.target.value))} clGenSelCont="generalFormSelectGenContainer" clGenSelLabel="generalFormSelectGenLabel" clGenSelSelect="generalFormSelectSGenelect" clGenSelOpt="generalFormSelectGenOption"
                    />
                </div>
                <div className="perFieldImgCont">
                    <ImageManager images={data.images} setImages={setImages} genderInput={"f"} textInput={TEXT.IMAGES} editable={true}/*  cThumbInput={TEXT.URL_IMG} */ cThumbInput={TEXT.SELECT_IMAGES_ADD}
                        /* cThumbCont={"thumbnailsContainerDetails"} cThumbAddCont={"thumbnailsAddContainerDetails"} 
                        cThumbPrevContainer={"thumnailsPreviewImgContainerDetails"} labelH2={""} valueH2={""} cThumbPrevImg={"thumbnailsImgPreviewDetails"}
                        cThumbImgContainer={"thumbnailsImgsContainerDetails"} cThumbImgBody={"thumbnailsImgBodyDetails"} cThumbImgBodyCont={"thumbnailsImgBodyContainerDetails"}
                        cImgDisplay={"thumbnailImageDisplayDetails"} idThumbBtnAdd={"thumbnailsImageBtnAdd"} */ />
                </div>
            </section >
        </>
    );
};

export default PersonFields;