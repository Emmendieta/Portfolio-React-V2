import PersonFields from "../../../personFields/personFields";
import "./personStep.css";

function PersonStep({ data, setFormData, handleChange, handleBlur, errors, touched, isSubbmited, list =[], language, isEdit = false }) {
    return(
        <div className="userFormPersonCont">
            <PersonFields data={data} setFormData={setFormData} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} isSubbmited={isSubbmited}
                list={list} language={language} isEdit={isEdit} />
        </div>
    );
};

export default PersonStep;