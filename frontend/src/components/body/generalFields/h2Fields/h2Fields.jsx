import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import "./h2Fields.css";

function H2Fields({ label, value, className = "divH2FieldsBody", classNameLabel = "h2FieldsLabel", classNameH2 = "h2FieldsValue", id = undefined, language }) {
    const TEXT = LANG_CONST[language];

    return (
        <div className={className} id={id}>
            { label && <h2 className={classNameLabel}>{label}: </h2>}
            <h2 className={classNameH2}>{value}</h2>
        </div>
    );
};

export default H2Fields;