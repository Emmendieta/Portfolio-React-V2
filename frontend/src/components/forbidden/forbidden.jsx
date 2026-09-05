import { LANG_CONST } from "../../constants/SelectLang.Constant";
import { useLanguage } from "../../context/Language.Context";
import H1Fields from "../body/generalFields/h1Fields/h1fields";
import "./forbidden.css";

function Forbidden() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="forbiddenCont">
            <H1Fields value={TEXT.FORBIDDEN} clH1Text="forbiddenH1Text"/>
            <img src="/img/forbidden.svg.png" alt="imgForbidden" className="imgForbidden" />
        </div>
    );
};

export default Forbidden;