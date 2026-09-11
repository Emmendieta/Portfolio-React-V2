import H1Fields from "../h1Fields/h1fields";
import "./forms.css";

function Forms({ textTitle, children, buttons, onSubmit, id = undefined, idButton = undefined, idForm = undefined, idTopCont = undefined, idBodyCont = undefined,
    idBottonCont = undefined
}) {
    return (
        <div id={id}>
            <form className="formCont" id={idForm} onSubmit={onSubmit}>
                <div className="formTopCont" id={idTopCont}>
                    <H1Fields label={textTitle} />
                </div>
                <div className="formBodyCont" id={idBodyCont}>{children}</div>
                <div className="formBottonCont" id={idBottonCont}>
                    {buttons?.map((btn, index) => (
                        <button key={index} type={btn.type || "button"} id={btn.idButton} className={`btn btn-outline-${btn.style}`} onClick={btn.onClick}>{btn.text}</button>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default Forms;