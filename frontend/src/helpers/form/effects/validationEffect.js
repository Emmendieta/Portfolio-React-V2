import { useEffect } from "react"

export const useValidationEffect = ( { formData, validate, hasErrors, setErrors, setIsFormValid}) => {
    useEffect(() => {
        //Execute the function of validation recibed:
        const validationErrors = validate(formData);
        //Save the posible errors:
        setErrors(validationErrors);
        //If has no Errors, the form is ready:
        setIsFormValid(!hasErrors(validationErrors));
    }, [formData, validate]);
};