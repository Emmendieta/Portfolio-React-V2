import { Link } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import { IoHome } from "react-icons/io5";
import LanguagesSelector from "./languagesSelector/languagesSelector";
import "./leftNavbar.css";

function LeftNavbar() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="leftNavCont">
            <section className="leftNavHomeCont">
                <Link to="/"><IoHome id="iconHome" /></Link>
            </section>
            <section className="leftNavLangCont">
                <LanguagesSelector />
            </section>
        </div>
    );
};

export default LeftNavbar;