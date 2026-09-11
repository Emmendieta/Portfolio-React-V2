import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import H1Fields from "../h1Fields/h1fields.jsx";
import "./Uls.css";

function Uls({ list = [], className = "ulWrapped", classNameUl="ulGeneral", classNameSect = "ulHeader", classnameli ="ulGeneraLi", idList = undefined, labelh1Field = "", valueH1Field = "", 
            idH1Field = "idH1Field", clH1TextDisp = "clH1TextDisp", language , renderItem }) {
    const TEXT = LANG_CONST[language];
    return (
        <div className={className}>
            {valueH1Field && (
                <section className={classNameSect}>
                    <H1Fields label={labelh1Field} value={valueH1Field} id={idH1Field} clH1Text={clH1TextDisp} language={language} />
                </section>
            )}
            <ul className={classNameUl} id={idList}>
            {list.map((element, index) => (
                <li key={element._id || index} className={classnameli}>
                    {renderItem(element, index)}
                </li>
            ))}
        </ul>
        </div>
    );
};

export default Uls;