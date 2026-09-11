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
                if (showError) { await errorSweet(`${TEXT.ERROR}: ${TEXT.USER_NOT_LOGGED}`); }
                if (redirect) { navigate("/login"); }
                return false;
            }
            // Permiso no enviado
            if (!permission) {
                console.error(`${TEXT.ERROR}: ${TEXT.ERROR_NO_PERMISSION_PROVIDED}!`);
                return false;
            };
            const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
            const allowed = userPermissions.includes(permission);
            if (!allowed) {
                if (showError) { await errorSweet(`${TEXT.ERROR} ${TEXT.NO_ENOUGH_PRIVILEGES}!`); }
                if (redirect) { navigate("/forbidden"); }
                return false;
            };
            return true;
        } catch (error) {
            console.error(`${TEXT.ERROR_CHECKING_PRIVILEGES}. ${TEXT.ERROR}: ${error.message}`);
            if (showError) { await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS); }
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
