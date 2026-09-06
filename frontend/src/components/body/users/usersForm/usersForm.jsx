import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { fetchCreateUserWithImages, fetchUpdateUserByIdWithImages, fetchUserByIdPopulate } from "../userLogic";
import UserStep from "./steps/UserStep/userStep";
import PersonStep from "./steps/PersonStep/personStep";
import RolesPermissionsStep from "./steps/RolesPermissionsStep/rolesPermissionsStep";
import { fetchGetAllContinentsPopulate } from "../../continents/continentsLogic";
import { fetchGetAllRolesPopulate } from "../../roles/rolesLogic";
import { fetchGetAllPermissions } from "../../permissions/permissionsLogic";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import { validatorAlphaNumeric, validatorCUILCUIT, validatorDate, validatorDNI, validatorEmail, validatorLongText, validatorName, validatorNumber, validatorPassword, validatorPhone, validatorUser } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./usersForm.css";
import { hasPrivilege } from "../../../../helpers/privileges.helper";

const emptyLocation = { _id: "", name: { es: "", en: "" } };
const emptyPerson = {
    dni: "", firstName: "", lastName: "", phone: "", jobTitle: { es: "", en: "" }, continents: { ...emptyLocation, countries: [] },
    countries: { ...emptyLocation, provinces: [] }, provinces: { ...emptyLocation, cities: [] }, cities: emptyLocation,
    address: { street: "", number: "", floor: "", aparment: "" }, legalAddress: { street: "", number: "", floor: "", aparment: "" }, images: [],
    aboutMe: { es: "", en: "" }
};

function UsersForm() {
    const { user: currentUser } = useContext(UserContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();
    const isEdit = id && id !== "new";
    const [showOtherLang, setShowOtherLang] = useState(false);
    const primaryLang = language;
    const secondaryLang = language === "es" ? "en" : "es";
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const [continentsList, setContinentsList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [permissionsList, setPermissionList] = useState([]);
    const [step, setStep] = useState(1);

    const validate = useCallback((data) => {
        const errors = { user: {}, person: {}, address: {} };
        //USER:
        try { validatorUser(data.user?.user, TEXT.ERROR_USER_NAME); } catch (error) { errors.user.user = error.message; };
        try { validatorEmail(data.user?.email, TEXT.ERROR_EMAIL); } catch (error) { errors.user.email = error.message; };
        try { validatorPassword(data.user?.password, TEXT.ERROR_PASSWORD); } catch (error) { errors.user.password = error.message; };
        //PERSON:
        try { validatorDNI(data.person?.dni, TEXT.ERROR_DNI_MIN_MAX); } catch (error) { errors.person.dni = error.message; };
        try { validatorName(data.person?.firstName, TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.person.firstName = error.message; };
        try { validatorName(data.person?.lastName, TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.person.lastName = error.message; };
        try { validatorCUILCUIT(data.person?.cuil, TEXT.ERROR_CUIL_CUIT); } catch (error) { errors.person.cuil = error.message; };
        try {
            validatorDate(data.person?.birthday, { allowFuture: false, maxYearsAgo: 120 }, TEXT.ERROR_DATE_EMPTY, TEXT.ERROR_DATE_FORMAT, TEXT.ERROR_DATE_INVALID, TEXT.ERROR_DATE_FUTURE, TEXT.ERROR_DATE_TOO_OLD);
        } catch (error) { errors.person.birthday = error.message; };
        try { validatorPhone(data.person?.phone, TEXT.ERROR_PHONE); } catch (error) { errors.person.phone = error.message; };
        try { validatorName(data.person?.jobTitle?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.person.jobTitlePrimary = error.message; };
        if (showOtherLang) {
            try { validatorName(data.person?.jobTitle?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.person.jobTitleSecondary = error.message; };
        };
        try { validatorAlphaNumeric(data.person?.address?.street, TEXT.ERROR_ONLY_ALPHANUMERICS); } catch (error) { errors.address.street = error.message; };
        try { validatorNumber(data.person?.address?.number, TEXT.ERROR_NUMBERS_MIN); } catch (error) { errors.address.number = error.message; };
        try { validatorNumber(data.person?.address?.floor, TEXT.ERROR_NUMBERS_MIN); } catch (error) { errors.address.floor = error.message; };
        try { validatorLongText(data.person?.aboutMe?.[primaryLang], "FALTA TEXTO ERROR LONG TEXT"); } catch (error) { errors.person.aboutMePrimary = error.message; };
        if (showOtherLang) { try { validatorLongText(data.person?.aboutMe?.[secondaryLang], "FALTA TEXTO ERROR LONG TEXT"); } catch (error) { errors.person.aboutMeSecondary = error.message; } };
        //FALTA VALIDAR CONTINENTES; COUNTRY; PROVINCE; CITY
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { user: { _id: "", user: "", email: "", password: "", active: true }, person: emptyPerson, roles: [], extraPermission: [] },
        validate, async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateUserByIdWithImages(id, data); // FALTA CAMBIAR
                else result = await fetchCreateUserWithImages(data); // FALTA CAMBIAR
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.PERSON} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/users");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    const canPeople = isEdit ? hasPrivilege(currentUser, "update_people") : hasPrivilege(currentUser, "create_people");
    const canUser = isEdit ? hasPrivilege(currentUser, "update_users") : hasPrivilege(currentUser, "create_users");
    const canPermission = isEdit ? hasPrivilege(currentUser, "update_permissions") : hasPrivilege(currentUser, "create_permissions");
    const canRole = isEdit ? hasPrivilege(currentUser, "update_roles") : hasPrivilege(currentUser, "create_roles");

    //En caso de Edit:
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (!currentUser) return;
                /*if(!canPeople && !canUser && (!canPermission && !canRole)) return;*/
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const continentsRes = await fetchGetAllContinentsPopulate();
                if (!continentsRes || !continentsRes?.response) return await errorSweet(`${TEXT.ERROR}: ${continentsRes?.response?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                const continents = continentsRes.response || [];
                setContinentsList(continents);
                const rolesRes = await fetchGetAllRolesPopulate();
                if (!rolesRes || !rolesRes?.response) return await errorSweet(`${TEXT.ERROR}: ${rolesRes?.response?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                const roles = rolesRes.response || [];
                setRolesList(roles);
                const permissionsRes = await fetchGetAllPermissions();
                if (!permissionsRes || !permissionsRes?.response) return await errorSweet(`${TEXT.ERROR}: ${permissionsRes?.response?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                const permissions = permissionsRes.response || [];
                setPermissionList(permissions);
                if (!isEdit) {
                }
                else {
                    const result = await fetchUserByIdPopulate(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const user = result.response || [];
                    const personDataRaw = user.people || emptyPerson;
                    const personData = {
                        ...personDataRaw, dni: personDataRaw?.dni ? String(personDataRaw.dni) : "", cuil: personDataRaw?.cuil ? String(personDataRaw.cuil) : "",
                        phone: personDataRaw?.phone ? String(personDataRaw.phone) : "", birthday: personDataRaw?.birthday ? personDataRaw.birthday.slice(0, 10) : ""
                    };
                    const selectedContinent = continents.find(con => con._id === personData.continents?._id) || { _id: "", name: { es: "", en: "" }, countries: [] };
                    const selectedCountry = selectedContinent.countries?.find(coun => coun._id === personData.countries?._id) || { _id: "", name: { es: "", en: "" }, provinces: [] };
                    const selectedProvince = selectedCountry.provinces?.find(pro => pro._id === personData.provinces?._id) || { _id: "", name: { es: "", en: "" }, cities: [] };
                    const selectedCity = selectedProvince.cities?.find(ci => ci._id === personData.cities?._id) || { _id: "", name: { es: "", en: "" } };
                    setFormData(prev => ({
                        ...prev, user: { _id: user._id, user: user.user || "", email: user.email || "", password: user.password || "", active: user.active ?? true },
                        person: {
                            ...personData, jobTitle: { es: personData.jobTitle?.es || "", en: personData.jobTitle?.en || "" }, continents: selectedContinent, countries: selectedCountry,
                            provinces: selectedProvince, cities: selectedCity, aboutMe: { es: personData.aboutMe?.es || "", en: personData.aboutMe?.en || "" },
                        }, roles: user.roles || [], extraPermission: user.extraPermission || [], images: personData?.images?.length ?
                            personData.images.map(img => ({ publicId: img.publicId, url: img.url, hash: img.hash, width: img.width, height: img.height, isMain: img.isMain || false, })) : [],
                    }));
                    console.log("PERSON DATA", personData);
                }
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadUser();
    }, [id, isEdit, currentUser, language, canPeople, canUser, canPermission, canRole]);

    const isStepValid = (stepNumber) => {
        if (stepNumber === 1) return !errors.user || Object.keys(errors.user).length === 0;
        if (stepNumber === 2) return !errors.person || Object.keys(errors.person).length === 0;
        return true;
    };

    return (
        <div className="userFormCont">
            <section className="userFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.USER}:` : `${TEXT.CREATE} ${TEXT.USER}:`} language={language} />
            </section>
            {/*(canUser && canPeople && (canPermission || canRole)) ? (*/}
                <>
                    <section className="userFormBody">
                        {(step === 1 /*&& canUser*/) && (
                            <UserStep data={formData.user} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} isSubmitted={isSubmitted} isEdit={isEdit} language={language} />
                        )}
                        {(step === 2 /*&& canPeople*/) && (
                            <PersonStep data={formData.person} setFormData={setFormData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} isSubmitted={isSubmitted} list={continentsList} language={language} isEdit={isEdit} />
                        )}
                        {(step === 3 /* && (canPermission || canRole)*/) && (
                            <RolesPermissionsStep roles={formData.roles} setRoles={(updater) => setFormData(prev => ({ ...prev, roles: typeof updater === "function" ? updater(prev.roles) : updater }))}
                                extraPermission={formData.extraPermission} setExtraPermission={(updater) => setFormData(prev => ({ ...prev, extraPermission: typeof updater === "function" ? updater(prev.extraPermission) : updater }))}
                                list={rolesList} permissionsList={permissionsList} language={language} />
                        )}
                    </section>
                    <div className="userFormDivContBottom">
                        <a className="btn btn-outline-danger" id="btnCancel" href="/users">{TEXT.CANCEL}</a>
                        {step > 1 && (<button type="button" className="btn btn-outline-primary" onClick={() => setStep(step - 1)}>{TEXT.PREV}</button>)}
                        {step < 3 ? (<button type="button" className="btn btn-outline-primary" onClick={() => setStep(step + 1)} disabled={!isStepValid(step)}
                            /* disabled={(step === 1 && !isValidFirstStep) || (step === 2 && !isValidSecondStep)} */>{TEXT.NEXT}</button>) : (
                            <button type="button" className="btn btn-outline-success" onClick={handleSubmit} disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                        )}
                    </div>
                </>  
            {/*): (
                <p>FALTA TEXTO NO TIENE ALGUNO DE LOS PERMISSOS PARA CREAR/EDITAR</p>
            )} */}
        </div>
    );
};

export default UsersForm;
