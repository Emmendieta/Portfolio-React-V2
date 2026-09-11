import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields//h2Fields/h2Fields";
import Uls from "../../generalFields/Uls/Uls";
import "./rolesPermissionsFields.css";

function RolesPermissionsFields({ roles = [], setRoles, extraPermission = [], setExtraPermission, rolesList = [], permissionsList = [], language }) {
    const TEXT = LANG_CONST[language];
    const assignedRoles = roles || [];
    const assignedExtraPermissions = extraPermission || [];

    const addRole = (role) => {
        setRoles(prevRoles => {
            const newRoles = [...prevRoles, role];
            // Agregamos los permisos del rol automáticamente:
            const newRolePermissions = role.permissions || [];
            setExtraPermission(prevPerms => {
                const updatedPerms = [...prevPerms];
                newRolePermissions.forEach(p => { if (!updatedPerms.some(existing => existing._id === p._id)) { updatedPerms.push(p); }; });
                return updatedPerms;
            });
            return newRoles;
        });
    };

    const removeRole = (roleId) => {
        setRoles(prevRoles => {
            const removedRole = prevRoles.find(r => r._id === roleId);
            const newRoles = prevRoles.filter(r => r._id !== roleId);
            // Permisos de todos los roles que siguen activos
            const remainingRolesPermissions = newRoles.flatMap(r => r.permissions || []);
            // Actualizamos permisos extra: solo eliminamos los que estaban asociados exclusivamente al rol que se quitó
            setExtraPermission(prevPerms => {
                return prevPerms.filter(p => {
                    const isInOtherRoles = remainingRolesPermissions.some(rp => rp._id === p._id);
                    const wasInRemovedRole = removedRole.permissions?.some(rp => rp._id === p._id);
                    // Si estaba en el rol eliminado y no está en ningún otro rol, lo sacamos
                    return !(wasInRemovedRole && !isInOtherRoles);
                });
            });
            return newRoles;
        });
    };
    const addExtraPermission = (permission) => {
        setExtraPermission(prev => {
            if (!prev.some(p => p._id === permission._id)) { return [...prev, permission]; };
            return prev;
        });
    };

    const removeExtraPermission = (permissionId) => { setExtraPermission(prev => prev.filter(p => p._id !== permissionId)); };

    // Roles disponibles: los que no están asignados
    const availableRoles = rolesList.filter(role => !assignedRoles.some(r => r._id === role._id));
    // Todos los permisos derivados de roles
    const permissionsFromRoles = assignedRoles.flatMap(r => r.permissions || []);
    // Todos los permisos disponibles para asignar
    // Si es nuevo usuario (sin roles asignados), tomamos todos los permisos del sistema
    const allPermissions = [...new Map([...permissionsFromRoles, ...permissionsList].map(p => [p._id, p])).values()];

    // Filtramos duplicados
    const uniqueAllPermissions = allPermissions.reduce((acc, perm) => {
        if (!acc.some(p => p._id === perm._id)) acc.push(perm);
        return acc;
    }, []);

    // Permisos disponibles: los que no están asignados
    const availableExtraPermissions = allPermissions.filter(p => !assignedExtraPermissions.some(ap => ap._id === p._id));

    return (
        <>
            <div className="userFormRolPerDivCont">
                <div className="userFormRolPerCont">
                    <div className="userFormRolCont">
                        <Uls list={availableRoles} valueH1Field={`${TEXT.ROLES_AVAILABLES}:`} language={language} idH1Field={"generalFormH1Field"} className={"formGeneralUlList"}
                            /*classnameli={"formGeneralUlLi"} classNameSect={"formGeneralSect"} idList={"generalFormIdUl"} */ renderItem={(role) => (
                                <button type="button" onClick={() => addRole(role)} className="rolePermissionAvailableBtn">
                                    <H2Fields value={role.role?.[language]} className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                                </button>
                            )} />
                        <Uls list={assignedRoles} valueH1Field={`${TEXT.ROLES_ASSIGNED}:`} language={language} idH1Field={"generalFormH1Field"} className={"formGeneralUlList"} classnameli={"formGeneralUlLi"}
                            /*classNameSect={"formGeneralSect"} idList={"generalFormIdUl"} */ renderItem={(role) => (
                                <button type="button" onClick={() => removeRole(role._id)} className="rolePermissionAssignedBtn">
                                    <H2Fields value={role.role?.[language]} className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                                </button>
                            )} />
                    </div>
                    <div className="userFormPerCont">
                        <Uls list={availableExtraPermissions} valueH1Field={`${TEXT.PERMISSIONS_AVAILABLES}:`} language={language} idH1Field={"generalFormH1Field"} className={"formGeneralUlList"}
                        /*classnameli={"formGeneralUlLi"} classNameSect={"formGeneralSect"} idList={"generalFormIdUl"} */ renderItem={(permission) => (
                                <button type="button" onClick={() => addExtraPermission(permission)} className="rolePermissionAvailableBtn">
                                    <H2Fields value={permission.name?.[language]} className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                                </button>
                            )} />
                        <Uls list={assignedExtraPermissions} valueH1Field={`${TEXT.PERMISSIONS_ASSIGNED}:`} language={language} idH1Field={"generalFormH1Field"} className={"formGeneralUlList"}
                        /*classnameli={"formGeneralUlLi"} classNameSect={"formGeneralSect"} idList={"generalFormIdUl"} */ renderItem={(permission) => (
                                <button type="button" onClick={() => removeExtraPermission(permission._id)} className="rolePermissionAssignedBtn" >
                                    <H2Fields value={permission.name?.[language]} className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />

                                </button>
                            )} />
                    </div>
                </div>
            </div>

        </>
    );
};

export default RolesPermissionsFields;