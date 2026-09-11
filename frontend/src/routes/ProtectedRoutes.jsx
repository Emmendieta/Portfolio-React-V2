/* import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User.Context";
import { Navigate, useParams } from "react-router-dom";
import { useSweetAlert } from "../context/SweetAlert2.Context";
import { useLanguage } from "../context/Language.Context";
import { LANG_CONST } from "../constants/SelectLang.Constant";

function ProtectedRoutes({ children, permission, permissionResolver }) {
    
    const { user } = useContext(UserContext);
    const { errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [redirect, setRedirect] = useState(null);
    const [checking, setChecking] = useState(true);
    const params = useParams();

    useEffect(() =>{
        let isMounted = true;
        const verifyPermission = async () => {
            try {
                if(!user) {
                    await errorSweet("FALTA EL TEXTO USUSARIO NO LOGUEADO!");
                    if(isMounted) {
                        setRedirect("/login");
                        setChecking(false);
                    };
                    return;
                };
                let requiredPermission = permission;
                if(permissionResolver) requiredPermission = permissionResolver(params);
                if(requiredPermission && !user.permission?.includes(requiredPermission)) {
                    await errorSweet("FALTA EL TEXTO FALTAN LOS PERMISOS");
                    if(isMounted) {
                        setRedirect("/forbidden");
                        setChecking(false);
                    };
                    return;
                };
                if(isMounted) setChecking(false);
            } catch (error) {
                if(isMounted) setChecking(false);
                console.error("Error: ", error.message);
                await errorSweet(error.message);
            }
        };
        verifyPermission();
        return () => isMounted = false;
    }, [user, permission, permissionResolver, params, language]);
    
    if(checking) return <div>CHECKING PERMISSIONS (CAMBIAR DESPUESS)...</div>;
    if(redirect) return <Navigate to={redirect} replace />;
    return children;
};

export default ProtectedRoutes; */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User.Context";
import { Navigate, useParams } from "react-router-dom";
import { useSweetAlert } from "../context/SweetAlert2.Context";
import { useLanguage } from "../context/Language.Context";
import { LANG_CONST } from "../constants/SelectLang.Constant";

function ProtectedRoutes({
    children,
    permission,
    permissionResolver
}) {
    const { user, loadingUser } = useContext(UserContext);
    const { errorSweet } = useSweetAlert();
    const { language } = useLanguage();

    const TEXT = LANG_CONST[language];

    const params = useParams();

    const [redirect, setRedirect] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyPermission = async () => {
            try {
                // Esperamos a que UserContext termine de cargar
                if (loadingUser) {
                    return;
                }

                // Usuario no logueado
                if (!user) {
                    if (isMounted) {
                        setRedirect("/login");
                        setChecking(false);
                    }

                    return;
                }

                // Permiso requerido
                let requiredPermission = permission;

                if (permissionResolver) {
                    requiredPermission = permissionResolver(params);
                }

                // Si la ruta no requiere permiso específico
                if (!requiredPermission) {
                    if (isMounted) {
                        setChecking(false);
                    }

                    return;
                }

                // IMPORTANTE:
                // El objeto de usuario tiene "permissions"
                const userPermissions = Array.isArray(user.permissions)
                    ? user.permissions
                    : [];

                const allowed = userPermissions.includes(
                    requiredPermission
                );

                if (!allowed) {
                    await errorSweet(
                        TEXT.NO_ENOUGH_PRIVILEGES ||
                        "No tienes los privilegios necesarios."
                    );

                    if (isMounted) {
                        setRedirect("/forbidden");
                        setChecking(false);
                    }

                    return;
                }

                if (isMounted) {
                    setChecking(false);
                }

            } catch (error) {
                console.error(
                    "Error verificando permisos:",
                    error.message
                );

                if (isMounted) {
                    setRedirect("/forbidden");
                    setChecking(false);
                }
            }
        };

        verifyPermission();

        return () => {
            isMounted = false;
        };

    }, [
        user,
        loadingUser,
        permission,
        permissionResolver,
        language
    ]);

    if (loadingUser || checking) {
        return (
            <div>
                CHECKING PERMISSIONS...
            </div>
        );
    }

    if (redirect) {
        return <Navigate to={redirect} replace />;
    }

    return children;
}

export default ProtectedRoutes;