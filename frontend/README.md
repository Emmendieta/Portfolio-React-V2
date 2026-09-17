

Sí. Viendo tu estructura, yo no lo pondría dentro de AppRoutes(). Ahí ya tenés toda la lógica de rutas, usuario, idioma, permisos, etc.

Lo más limpio es crear un componente específico, por ejemplo TermsAndConditions.jsx, y montarlo dentro de App, antes de BrowserRouter o dentro de él.

Además, como ya tenés LanguageProvider arriba de todo, el componente puede usar useLanguage() para mostrar los términos en español/inglés si querés.
1. Crear TermsAndConditions.jsx

Por ejemplo:

import { useEffect } from "react";
import Swal from "sweetalert2";
import { getCookie, setCookie, deleteCookie } from "../helpers/Cookies.helper";

const TermsAndConditions = () => {

    useEffect(() => {

        const termsAccepted = getCookie("PortfolioEMMTerms");

        if (termsAccepted === "accepted") {
            return;
        }

        Swal.fire({
            title: "Términos y condiciones",
            html: `
                <div style="text-align: left; max-height: 300px; overflow-y: auto;">
                    <p>
                        Acá van tus términos y condiciones.
                    </p>

                    <p>
                        Al aceptar, confirmás que leíste y aceptás
                        los términos y condiciones de uso.
                    </p>
                </div>
            `,
            icon: "info",
            confirmButtonText: "Aceptar",
            showDenyButton: true,
            denyButtonText: "No aceptar",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {

            if (result.isConfirmed) {
                setCookie("PortfolioEMMTerms", "accepted");
                return;
            }

            if (result.isDenied) {
                // Acá después ponemos exactamente
                // qué cookies querés borrar.

                deleteCookie("PortfolioEMMLang");

                // Si tenés otras cookies:
                // deleteCookie("nombreCookie");

                Swal.fire({
                    title: "Acceso no permitido",
                    text: "Para utilizar el sitio debés aceptar los términos y condiciones.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
            }

        });

    }, []);

    return null;
};

export default TermsAndConditions;

2. Después lo agregamos en tu App

Tu App actualmente es:

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <RefreshProvider>
          <AppRoutes />
        </RefreshProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

Podríamos dejarlo así:

import TermsAndConditions from "./components/termsAndConditions/TermsAndConditions";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <RefreshProvider>

          <TermsAndConditions />

          <AppRoutes />

        </RefreshProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

De esta manera TermsAndConditions se monta una sola vez cuando arranca la aplicación.
Pero hay algo importante

En el código de arriba puse:

deleteCookie("PortfolioEMMLang");

solamente como ejemplo.

Vos dijiste originalmente:

    "si no acepta, se tiene que borrar el resto"

Entonces antes de implementar eso definitivamente, necesito saber qué otras cookies tenés.

Por ejemplo, si tenés:

PortfolioEMMLang
PortfolioEMMToken
PortfolioEMMUser
PortfolioEMMRefreshToken
...

podemos hacer:

deleteCookie("PortfolioEMMLang");
deleteCookie("PortfolioEMMToken");
deleteCookie("PortfolioEMMUser");
deleteCookie("PortfolioEMMRefreshToken");

Pero NO borraríamos:

deleteCookie("PortfolioEMMTerms");

porque si el usuario rechaza, justamente queremos que siga sin estar aceptado, para que cuando vuelva a entrar vuelva a aparecer.
Y una cosa más

Hay que decidir qué hacemos después de "No aceptar".

Yo veo dos posibilidades:

A. Mostrar el mensaje y dejar la página bloqueada.

B. Borrar las cookies, cerrar sesión si corresponde y redirigir al usuario fuera de la aplicación.

Para tu caso, por lo que contás, B probablemente sea más coherente si los términos son obligatorios.

Si me pasás ahora qué cookies manejás además de PortfolioEMMLang (podés hacer Ctrl+Shift+F buscando setCookie( en VS Code), te armo exactamente la función rejectTerms() para limpiar todo correctamente.