import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import H2Fields from "../../../body/generalFields/h2Fields/h2Fields";
import "./centerNavbar.css";

function CenterNavbar() {

    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    
    return (
        <H2Fields value={TEXT.MENDIETA_EMILIANO} className="centNavCont" classNameH2="centerNavH2" classNameLabel="centerNavLabel" language={language}/>
    );
};

export default CenterNavbar;