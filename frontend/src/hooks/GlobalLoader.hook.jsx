import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLoading } from "../context/Loading.Context";
import { useEffect, useRef } from "react";
import { useLanguage } from "../context/Language.Context";
import { LANG_CONST } from "../constants/SelectLang.Constant";

const MySwal = withReactContent(Swal);
const MIN_VISIBLE_TIME_MS = 1000;

function GloablLoader() {
    const { isLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const openTimeRef = useRef(null);
    const timeoutRef = useRef(null);
    const isShownRef = useRef(false);

    useEffect(() => {
        if(isLoading && !isShownRef.current) {
            isShownRef.current = true;
            openTimeRef.current = Date.now();
            MySwal.fire({
                title: `${TEXT.LOADING}...`,
                icon: "info",
                theme: "dark",
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'custom-swal-popup'
                },
                didOpen: () => { Swal.showLoading(); }
            });
        };
        if(!isLoading && isShownRef.current) {
            const now = Date.now();
            const elapsed = now - (openTimeRef.current || 0);
            const remainingTime = Math.max(MIN_VISIBLE_TIME_MS - elapsed, 0);
            timeoutRef.current = setTimeout(() => {
                Swal.close();
                isShownRef.current = false;
                openTimeRef.current = null;
            }, remainingTime);
        };
        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            };
        };
    }, [isLoading]);
    return null;
};

export default GloablLoader;