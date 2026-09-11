import "./checkboxs.css";

function CheckBoxs({ textH2="", name="", checked= false, onChange, readOnly= false, disabled= false,
    clCheckCont = "divInputCheckboxBody", clCheckH2 = "", clCheckInput= "divInputCheckbox", clCheckLabel = "clCheckLabel", id= undefined }) {

    return (
        <div className={clCheckCont} id={id}>
            <label style={{ cursor: "pointer" }} className={clCheckLabel}>
                <input type="checkbox" name={name} className={clCheckInput} checked={checked} onChange={onChange} readOnly={readOnly} 
                    disabled={disabled} />{textH2 && <span className={clCheckH2}>{textH2}</span>}
            </label>
        </div>
    );
};

export default CheckBoxs;