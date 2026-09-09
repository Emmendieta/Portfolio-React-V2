import { LANG_CONST } from "../../constants/SelectLang.Constant";
import { useLanguage } from "../../context/Language.Context";
import H1Fields from "../body/generalFields/h1Fields/h1fields";
import "./notFound.css";

function NotFound() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="notFoundCont">
            <H1Fields value={`${TEXT.ERROR}: ${TEXT.ERROR_NOT_FOUND}!`} clH1Text="notFoundH1Text" />
            <img src="/img/oops.png" alt="imgNotFound" className="imgNotFound" />
        </div>
    );
};

export default NotFound;