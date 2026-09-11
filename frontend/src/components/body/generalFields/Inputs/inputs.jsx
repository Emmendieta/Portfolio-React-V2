import "./inputs.css";

function Inputs({ textH2 = "", type = "text", name = "", className = undefined, cNContainer = "divInputsContainer", cNSecTop = "divInputTop", cnSectBottom = "divInputBottom",
    placeHolder = "", id = undefined, value, onChange, onKeyPress, onBlur, readOnly = false, disabled = false, error = null }) {

    const inputClass = `${className} ${error ? "inputError" : ""}`;

    return (
        <div className={cNContainer}>
            <section className={cNSecTop}>
                <h2>{textH2}:</h2>
            </section>
            <section className={cnSectBottom}>
                <input type={type} name={name} className={inputClass} placeholder={placeHolder} id={id} value={value} onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur}
                    readOnly={readOnly} disabled={disabled} />
                {error && (<p className="inputErrorText">{error}</p>)}
            </section>
        </div>
    );
};

export default Inputs;

