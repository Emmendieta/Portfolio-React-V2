
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import "./textAreaFields.css";

function TextAreaFields({ label, value, name = "", className = "divTextAreaFieldBody", classNameLabel = "textAreaLabel", classNameTextArea = "textAreaValue", id = undefined, idText = undefined, langauge, placeholder="", onChange ={onChange} }) {
    const TEXT = LANG_CONST[langauge];
    return (
        <div className={className} id={id}>
            {label && <h2 className={classNameLabel}>{label}: </h2>}
            <textarea id={idText} name={name} className={classNameTextArea} value={value} placeholder={placeholder} onChange={onChange}></textarea>
        </div>
    );
};

export default TextAreaFields;