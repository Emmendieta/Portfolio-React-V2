/* import { useNavigate } from "react-router-dom"
import { useSweetAlert } from "../context/SweetAlert2.Context";
import { useLanguage } from "../context/Language.Context";
import { LANG_CONST } from "../constants/SelectLang.Constant";

export const userVerifyPrivileges = () => {
    const navigate = useNavigate();
    const { errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    const verifyPrivileges = async (user, permission) => {
        try {
            console.log("USER EN VERIFY PRIVILEGIOS", user);
            if(!user) {
                await errorSweet("FALTA TEXTO USUARIO NO LOGUEADO");
                navigate("/forbidden");
                return false;
            };
            if(!permission) throw new Error("FALTA TEXTO Error: No permission provided!");
            if(!user.permissions?.includes(permission)) {
                await errorSweet("FALTA TEXTO SIN LOS PRIVILEGIOS!");
                navigate("/forbbiden");
                return false;
            };
            return true;
        } catch (error) {
            console.error("Error: ", error.message);
            return false;
        }
    };
    return { verifyPrivileges };
}; */


import { useNavigate } from "react-router-dom";
import { useSweetAlert } from "../context/SweetAlert2.Context";
import { useLanguage } from "../context/Language.Context";
import { LANG_CONST } from "../constants/SelectLang.Constant";

export const userVerifyPrivileges = () => {
    const navigate = useNavigate();
    const { errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    const verifyPrivileges = async (user, permission, options = {}) => {
        const {
            showError = false,
            redirect = false
        } = options;
        try {
            // Usuario no logueado
            if (!user) {
                if (showError) { await errorSweet(TEXT.USER_NOT_LOGGED || "Usuario no logueado."); }
                if (redirect) { navigate("/login"); }
                return false;
            }
            // Permiso no enviado
            if (!permission) {
                console.error("Error: No permission provided!");
                return false;
            };
            // IMPORTANTE:
            // Tu objeto tiene "permissions", NO "permission"
            const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
            const allowed = userPermissions.includes(permission);
            if (!allowed) {
                if (showError) { await errorSweet( TEXT.NO_ENOUGH_PRIVILEGES || "No tienes los privilegios necesarios." ); }
                if (redirect) { navigate("/forbidden"); }
                return false;
            };
            return true;
        } catch (error) {
            console.error("Error verificando privilegios:", error);

            if (showError) { await errorSweet(`${TEXT.ERROR || "Error"}: ${error.message}` ); }
            return false;
        }
    };

    return { verifyPrivileges };
};

    export const hasPrivilege = (user, permission) => {
        if (!user || !permission) return false;
        const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
        return userPermissions.includes(permission);
    };
