import { useContext } from "react";
import { createContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const confirmContext = createContext();
const MySwal = withReactContent(Swal);

export const ConfirmProvider = ({ children }) => {
    //CONFIRM:
    const confirmSweet = async ({
        title = "Are you sure?",
        text = "",
        icon = "warning",
        confirmButtonText = "Yes",
        cancelButtonText = "Cancel",
        ...rest
    }) => {
        const result = await MySwal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
            ...rest
        });
        return result.isConfirmed;
    };

    //SUCCESS:
    const successSweet = async (text = "Action Completed!") =>
        await MySwal.fire({
            icon: "success",
            title: "Success",
            text,
            confirmButtonText: "Ok",
            returnFocus: false,
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
        });

    //ERROR:
    const errorSweet = async (text = "Something went wrong!") =>
        await MySwal.fire({
            icon: "error",
            title: "Error:",
            text,
            confirmButtonText: "Ok",
            returnFocus: false,
            theme: 'dark',
            customClass: {
                popup: 'custom-swl-popup'
            },
        });

    //INFO:
    const infoSweet = async (text = "Information") =>
        await MySwal.fire({
            icon: "info",
            title: "Info:",
            text,
            confirmButtonText: "Ok",
            returnFocus: false,
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
        });

    return ( <confirmContext.Provider value={{ confirmSweet, successSweet, errorSweet, infoSweet }}>{children}</confirmContext.Provider> );
};

export const useSweetAlert = () => useContext(confirmContext);