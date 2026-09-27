export const createHandleSubmit = ({ formData, validate, onSubmit, setErrors, setIsSubmitted, hasErrors }) => {
    return async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (!hasErrors(validationErrors) && onSubmit) {
            const dataToSend = { ...formData };
            if (dataToSend.dni) {
                dataToSend.dni = Number(dataToSend.dni);
            };
            await onSubmit(dataToSend);
        };
    };
};