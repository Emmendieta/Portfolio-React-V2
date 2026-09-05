import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import "./h1fields.css";

function H1Fields({ label, value = "", id = undefined, clH1Cont = "divH1FieldsBody", clH1Text = "h1FieldsText", language }) {
    const TEXT = LANG_CONST[language];
    return (
        <div id={id} className={clH1Cont}>
            <h1 className={clH1Text}>{label} {value}</h1>
        </div>
    )
};

export default H1Fields;