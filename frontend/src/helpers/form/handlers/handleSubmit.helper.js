import { generateCUILFromDNI } from "../../generateCUILFromDNI.helper";

export const createHandleSubmit = ({ formData, validate, onSubmit, setErrors, setIsSubmitted, hasErrors }) => {
    return async(e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if(!hasErrors(validationErrors) && onSubmit) {
            const dataToSend = { ...formData };
            if(dataToSend.dni) {
                const dni = Number(dataToSend.dni);
                if(!isNaN(dni)&& dni > 0) {
                    dataToSend.dni = dni;
                    dataToSend.cuil = generateCUILFromDNI(dni, 27);
                };
            };
            await onSubmit(dataToSend);
        };
    };
};