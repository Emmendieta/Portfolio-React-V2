import "./selectsV2.css";

function SelectsV2({ label, name, options = [], value = "", onChange, onBlur, error = null, getValue = (item) => item._id, getLabel = (item, lang) => item.name?.[lang] ?? "", language,
    disabled = false, placeholder = "", clGenSelCont = "genSelectContainer", clGenSelContDiv = "genSelectContDiv", clGenSelConError = "genSelectContError", clGenSelLabel = "genSelectLabel", clGenSelSelect = "genSelectSelect",
    clGenSelOpt = "genSelectOption" }) {

    const selectClass = `${clGenSelSelect} ${error ? "inputErrorSelectV2" : ""}`;

    return (
        <div className={clGenSelCont}>
            <div className={clGenSelContDiv}>
                {label && <label className={clGenSelLabel}>{label}</label>}
                <select value={value} name={name} disabled={disabled} className={clGenSelSelect} onChange={onChange} onBlur={onBlur} >
                    <option value="" className={clGenSelOpt}>{placeholder}</option>
                    {options.map(item => (
                        <option key={getValue(item)} value={getValue(item)} className={clGenSelOpt}>{getLabel(item, language)}</option>
                    ))}
                </select>
            </div>
            <div className={clGenSelConError}>
                {error && (<p className="inputErrorText">{error}</p>)}
            </div>
        </div>
    );
};

export default SelectsV2;
