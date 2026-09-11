import { useState } from "react";
import { useDNIEffect } from "../helpers/form/effects/dniEffect.helper";
import { useValidationEffect } from "../helpers/form/effects/validationEffect";
import { createHandleChange } from "../helpers/form/handlers/handleChange.helper";
import { createHandleBlur } from "../helpers/form/handlers/handleBlur.helper";
import { createHandleSubmit } from "../helpers/form/handlers/handleSubmit.helper";
import { hasErrors } from "../helpers/form/nested.form.helper";

export function FormValidation(initialValues, validate, onSubmit) {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    /* --------- Effects  --------- */

    //DNI -> Automatic CUIL:
    useDNIEffect( { formData, setFormData });

    //Automatic Validation:
    useValidationEffect({ formData, validate, hasErrors, setErrors, setIsFormValid });

    /* --------- Handlers --------- */

    const handleChange = createHandleChange({ setFormData, setTouched });

    const handleBlur = createHandleBlur({ setFormData, setTouched });

    const handleSubmit = createHandleSubmit({ formData, validate, onSubmit, setErrors, setIsSubmitted, hasErrors });

    /* --------- Datos expuestos al componente --------- */

    return {
        //Sate of the form:
        formData,
        //Errors found:
        errors,
        //Fields that was touched:
        touched,
        //To known if was intented to send:
        isSubmitted,
        //Allows/disabled the submit:
        isFormValid,
        //Events:
        handleChange, handleBlur, handleSubmit,
        //Allow to manual modify:
        setFormData
    };
};