import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import "./h2FieldsBool.css";

function H2FieldsBool({ label, value, id = "", name, onChange, isReadyOnly: propReadOnly, clH2BoolCont = "divH2FieldsBoolBody", clH2FieldsBoolLabel = "h2FieldsBoolLabel",
    clH2FieldsBoolValue = "h2FieldsBoolValue", clH2FieldsBoolInput = "h2FieldsBoolInput" }) {
        const {language } = useLanguage();
        const TEXT = LANG_CONST[language];
        const isReadOnly = propReadOnly ?? !onChange;
        if(isReadOnly) {
            return (
                <div className={clH2BoolCont} id={id}>
                    <h2 className={clH2FieldsBoolLabel}>{label}: </h2>
                    <h2 className={clH2FieldsBoolValue}>{value ? TEXT.YES: TEXT.NO}</h2>
                </div>
            );
        } else {
            return (
                <div className={clH2BoolCont} id={id}>
                    <h2 className={clH2FieldsBoolLabel}>{label}: </h2>
                    <input className={clH2FieldsBoolInput} type="checkbox" name={name} checked={value} onChange={onChange} readOnly={isReadOnly} />
                </div>
            );
        };
    };

    export default H2FieldsBool;