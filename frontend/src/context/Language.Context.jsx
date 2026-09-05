import { createContext } from "react";
import { setCookie, getCookie } from "../helpers/Cookies.helper.js";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const safeLanguages = ["es", "en"];

    const getInitialLang = () => {
        try {
            const saved = getCookie("PortfolioEMMLang");
            if(safeLanguages.includes(saved)) {
                return saved;
            };
            setCookie("PortfolioEMMLang", "es");
            return "es";
        } catch (error) { return "es"; }
    };

    const [language, setLanguage] = useState(getInitialLang);
    useEffect(()=> {
        const savedLang = getCookie("PortfolioEMMLang");
        if(!safeLanguages.includes(savedLang)) {
            setCookie("PortfolioEMMLang", "es");
            setLanguage("es");
        };
    }, []);

    const changeLanguage = (lang) => {
        if(!safeLanguages.includes(lang)) return;
        setLanguage(lang);
        setCookie("PortfolioEMMLang", lang);
    };
    
    return ( <LanguageContext.Provider value= {{ language, changeLanguage }}>{ children }</LanguageContext.Provider> );
};

export const useLanguage = () => useContext(LanguageContext);
