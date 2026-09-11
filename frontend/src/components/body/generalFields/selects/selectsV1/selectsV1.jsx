import { LANG_CONST } from "../../../../../constants/SelectLang.Constant";
import H1Fields from "../../h1Fields/h1fields";
import H2Fields from "../../h2Fields/h2Fields";
import Uls from "../../Uls/Uls";
import "./selectsV1.css";

function SelectsV1({ titleAvailable = "", titleSelected = "", availableItems = [], selectedItems = [], selectedItemId, onChangeSelect, onAdd, onRemove, getLabel, valueDefault = "",
    language, classCont = "genFormSelectContainer", classContTitle = "genFormSelectTitle", idH1FieldTitle = "genFormSelectH1", classContBody = "genFormSelectBodyContainer",valueDefualtNo = "",
    classBodySelectItems = "genFormSelectSelectItemsContainer", idSelectItems = "genFormSelectItems", classBodyList = "genFormSelectSectContainer", selectListUl = "genFormSelectUl", selectListUlLi = "genFormSelectUlLi",
    selectListUlH1 = "genFormSelectUlH1", selectListUlLiDiv = "genFormSelectUlLiDiv", selectListUlLiDivH2 = "genormSelectUlLiDivH2", idH1FieldsTitleSelect = "genFormSelectH1TitleSelect", classUlCont = "genFormUlContainer"
}) {
    const TEXT = LANG_CONST[language];

    return (
        <div className={classCont}>
            <section className={classContTitle}>
                <H1Fields label={`${titleAvailable}`} value={""} id={idH1FieldTitle}></H1Fields>
            </section>
            <section className={classContBody}>
                <div className={classBodySelectItems}>
                    <select name="" id={idSelectItems} value={selectedItemId} onChange={(e) => onChangeSelect(e.target.value)}>
                        <option value="">{valueDefault}</option>
                        {availableItems.map(item => (
                            <option key={item._id} value={item._id}>{getLabel(item, language)}</option>
                        ))}
                    </select>
                    <button type="button" onClick={onAdd} disabled={!selectedItemId} className="btn btn-outline-success selectBtnAddV1">{TEXT.ADD}</button>
                </div>
            </section>
            <section className={classBodyList}>
                {selectedItems.length > 0 && (
                    <H1Fields label={`${titleSelected}:`} value={""} id={idH1FieldsTitleSelect} language={language} />
                )}
                {selectedItems.length === 0 && (
                    <H1Fields label={""} value={valueDefualtNo} id={idH1FieldsTitleSelect} language={language} />
                )}
                <Uls list={selectedItems} className={classUlCont} classNameUl={selectListUl} classnameli={selectListUlLi} idH1Field={selectListUlH1} language={language} renderItem={(item) => (
                    <div key={item._id} className={selectListUlLiDiv}>
                        <H2Fields value={item.name?.[language] || ""} className={selectListUlLiDivH2} language={language} classNameH2 ="selectV1H2Text"/>
                        <button type="button" className="btn btn-outline-danger selectBtnRemoveV1" onClick={() => onRemove(item._id)}>❌</button>
                    </div>
                )} />
            </section>
        </div>
    );
};

export default SelectsV1;