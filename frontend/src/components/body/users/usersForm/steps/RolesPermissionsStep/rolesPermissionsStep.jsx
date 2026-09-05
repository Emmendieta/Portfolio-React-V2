import { LANG_CONST } from "../../../../../../constants/SelectLang.Constant";
import RolesPermissionsFields from "../../../rolesPermissionsFields/rolesPermissionsFields";
import "./RolesPermissionsStep.css";

function RolesPermissionsStep({ roles, setRoles, extraPermission, setExtraPermission, list, permissionsList, language }) {
    const TEXT = LANG_CONST[language];

    return(
        <div className="userFormRolPerCont">
            <RolesPermissionsFields roles={roles} setRoles={setRoles} extraPermission={extraPermission} setExtraPermission={setExtraPermission} rolesList={list} permissionsList={permissionsList} language={language} />
        </div>
    );
};

export default RolesPermissionsStep;