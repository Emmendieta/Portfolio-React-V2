import { LANG_CONST } from "../../../../../../constants/SelectLang.Constant";
import CheckBox from "../../../../generalFields/checkboxs/checkboxs";
import Inputs from "../../../../generalFields/Inputs/inputs";
import "./userStep.css";

function UserStep({ data, handleChange, handleBlur, errors, touched, isSubmitted, language, isEdit }) {
    const TEXT = LANG_CONST[language];

    return (
        <div className="userStepCont">
            {isEdit && (
                <Inputs textH2={TEXT.ID} type="text" name={"_id"} value={data._id} language={language} readOnly={true} disabled={true}
                    className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
            )}
            <Inputs textH2={TEXT.USER} type="text" name={"user.user"} value={data.user} onChange={handleChange} onBlur={handleBlur} error={(touched[`user.user`] || isSubmitted) && errors.user?.user} language={language} placeHolder={TEXT.inputsText("m", TEXT.USER)}
                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
            <Inputs textH2={TEXT.EMAIL} type="text" name={"user.email"} value={data.email} onChange={handleChange} onBlur={handleBlur} error={(touched[`user.email`] || isSubmitted) && errors.user?.email} language={language} placeHolder={TEXT.inputsText("m", TEXT.EMAIL)}
                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
            <CheckBox name="user.active" textH2={TEXT.ACTIVE} checked={data.active} onChange={(e) => handleChange(e)} />
            <Inputs textH2={TEXT.PASSWORD} type="password" name={"user.password"} value={data.password} onChange={handleChange} onBlur={handleBlur} error={(touched[`user.password`] || isSubmitted) && errors.user?.password} language={language} placeHolder={TEXT.inputsText("f", TEXT.PASSWORD)}
                className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
            ✔ mínimo 8 caracteres
            ✔ al menos 1 mayúscula
            ✔ al menos 1 minúscula
            ✔ al menos 1 número
            ✔ al menos 1 carácter especial
            ✔ sin espacios
            {/* <Inputs textH2={""} type="" className={"userFormInputs"} value={formData.} language={language} /> ESTE ES EL VALIDAR DEL PASSWORD */}
        </div>
    );
};

export default UserStep;