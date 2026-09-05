import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import Inputs from "../../generalFields/Inputs/inputs";
import { fetchCreateRole, fetchRolePopulateById, fetchUpdateRoleById } from "../rolesLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { fetchGetAllPermissions } from "../../permissions/permissionsLogic";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import CheckBox from "../../generalFields/checkboxs/checkboxs";
import { validatorName } from "../../../../helpers/validators.helper";
import { FormValidation } from "../../../../hooks/formValidation.hook";
import "./rolesForm.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function RoleForm() {
    const { user } = useContext(UserContext);
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
    const [allPermissions, setAllPermissions] = useState([]);
    const { verifyPrivileges } = userVerifyPrivileges();

    const validate = useCallback((data) => {
        const errors = {};
        try { validatorName(data.role?.[primaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.rolePrimary = error.message; };
        if (showOtherLang) { try { validatorName(data.role?.[secondaryLang], TEXT.ERROR_ONLY_WORD_MAX_MIN); } catch (error) { errors.roleSecondary = error.message; }; };
        return errors;
    }, [primaryLang, secondaryLang, showOtherLang, TEXT]);

    //Hooks para validar:
    const { formData, errors, touched, isFormValid, isSubmitted, handleChange, handleBlur, handleSubmit, setFormData } = FormValidation(
        { _id: "", role: { es: "", en: "" }, permissions: [] },
        validate,
        async (data) => {
            try {
                let result;
                setLoading(true);
                startLoading();
                if (isEdit) result = await fetchUpdateRoleById(id, data);
                else result = await fetchCreateRole(data);
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                await successSweet(`${TEXT.ROLE} ${isEdit ? TEXT.UPDATE_SUCCESS : TEXT.CREATE_SUCCESS}`);
                navigate("/roles");
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        }
    );

    //Cargar role en caso de edit:
    useEffect(() => {
        const loadRole = async () => {
            try {
                const permission = isEdit ? "update_roles": "create_roles";
                const allowed = await verifyPrivileges(user, permission);
                if(!allowed) return;
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                const allPermissionRes = await fetchGetAllPermissions();
                if (!allPermissionRes || !allPermissionRes.response) {
                    //FALTA EL SWEET
                    return;
                };
                let available = allPermissionRes.response || [];
                //FALTA PERMISO PARA CREAR:
                if (!isEdit) {
                    setAllPermissions(available);
                }
                //FALTA PERMISO PARA EDITAR:
                else {
                    const result = await fetchRolePopulateById(id);
                    if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    const role = result.response || [];
                    setAllPermissions(available);
                    setFormData(prev => ({ ...prev, _id: role._id, role: { es: role.role?.es || "", en: role.role?.en || "" }, permissions: role.permissions || [] }));
                }
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadRole();
    }, [id, isEdit, user, language]);

    const assignedPermissions = formData.permissions;
    const availablePermissions = allPermissions.filter(per => !assignedPermissions.some(ap => ap._id === per._id));
    const addPermission = (permission) => { setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission] })); };
    const removePermission = (permissionId) => { setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(per => per._id !== permissionId) })); };

    return (
        <div className="rolFormCont">
            <section className="rolFormSectTitle">
                <H1Fields value={isEdit ? `${TEXT.UPDATE} ${TEXT.ROLE}:` : `${TEXT.CREATE} ${TEXT.ROLE}:`} language={language} />
            </section>
            <section className="rolFormSectForm">
                <form id="rolForm" onSubmit={handleSubmit}>
                    <div className="rolFormDivCont">
                        <div className="rolFormCheckCont">
                            <CheckBox name={"showOtherLang"} textH2={`${TEXT.SHOW} (${secondaryLang.toUpperCase()})`} checked={showOtherLang} onChange={(e) => setShowOtherLang(e.target.checked)} />
                        </div>
                        {isEdit && (
                            <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={formData._id} language={language} readOnly={true} disabled={true}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}
                        <Inputs textH2={`${TEXT.NAME} ${primaryLang.toUpperCase()}`} type="text" name={"role"} placeHolder={TEXT.inputsText("m", TEXT.NAME)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_ROLE)} */ value={formData.role?.[primaryLang] || ""}
                            onChange={(e) => handleChange(e, primaryLang)} onBlur={(e) => handleBlur(e, primaryLang)} error={(touched[`role_${primaryLang}`] || isSubmitted) && errors.rolePrimary} language={language}
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        {showOtherLang && (
                            <Inputs textH2={`${TEXT.NAME} ${secondaryLang.toUpperCase()}`} type="text" name={"role"} placeHolder={TEXT.inputsText("m", TEXT.NAME)}/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_ROLE)} */ value={formData.role?.[secondaryLang] || ""}
                                onChange={(e) => handleChange(e, secondaryLang)} onBlur={(e) => handleBlur(e, secondaryLang)} error={(touched[`role_${secondaryLang}`] || isSubmitted) && errors.roleSecondary} language={language}
                                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        )}

                        <div className="rolFormUlsCont">
                            <Uls list={availablePermissions} valueH1Field={`${TEXT.PERMISSIONS_AVAILABLES}:`} language={language} /* idH1Field={"generalFormH1Field"}   className={"formGeneralUlList"} classnameli={"formGeneralUlLi"} classNameSect={"formGeneralSect"} idList={"generalFormIdUl"}  */renderItem={(permission) => (
                                <button type="button" onClick={() => addPermission(permission)} className="btn btn-outline-success btnAddAssignedUls" >
                                    <H2Fields value={permission.name?.[language]} className="clBtnAddAssigned" classNameH2="clBtnAddAssignedH2" />
                                </button>
                            )} />
                            <Uls list={assignedPermissions} valueH1Field={`${TEXT.PERMISSIONS_ASSIGNED}:`} language={language} /*  idH1Field={"generalFormH1Field"} className={"formGeneralUlList"} classnameli={"formGeneralUlLi"} classNameSect={"formGeneralSect"} idList={"generalFormIdUl"} */ renderItem={(permission) => (
                                <button type="button" onClick={() => removePermission(permission._id)} className="btn btn-outline-danger btnAddUnassignedUls" >
                                    <H2Fields value={permission.name?.[language]} className="clBtnRemoveAssigned" classNameH2="clBtnRemoveAssignedH2" />
                                </button>
                            )} />
                        </div>
                        <div className="rolFormDivContBottom">
                            <a className="btn btn-outline-primary" id="btnGoBack" href="/">{TEXT.HOME}</a>
                            <a className="btn btn-outline-danger" id="btnCancel" href="/roles">{TEXT.CANCEL}</a>
                            <button type="submit" className="btn btn-outline-success" disabled={!isFormValid}>{isEdit ? TEXT.UPDATE : TEXT.CREATE}</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default RoleForm;