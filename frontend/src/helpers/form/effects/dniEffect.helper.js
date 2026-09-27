import { useEffect } from "react"
import { generateCUILFromDNI, getCUILPrefixByGender } from "../../generateCUILFromDNI.helper";

/* export const useDNIEffect = ({ formData, setFormData }) => {
    useEffect(() => {
        if (!formData.dni || !formData.gender) return;
        const numericDNI = Number(formData.dni);
        if (isNaN(numericDNI) || numericDNI <= 0) return;
        const prefix = getCUILPrefixByGender(formData.gender);
        if (prefix === null) return;
        const generatedCUIL = generateCUILFromDNI(numericDNI, prefix);
        if (formData.cuil === generatedCUIL) return;
        setFormData(prev => ({
            ...prev,
            dni: numericDNI,
            cuil: generatedCUIL
        }));
    }, [formData.dni, formData.gender, formData.cuil, setFormData]);
}; */

/* export const useDNIEffect = ({ formData, setFormData, personNested = false }) => {
    useEffect(() => {
        const data = personNested ? formData.person : formData;
        if (!data?.dni || !data?.gender) return;
        const numericDNI = Number(data.dni);
        if (isNaN(numericDNI) || numericDNI <= 0) return;
        const prefix = getCUILPrefixByGender(data.gender);
        if (prefix === null) return;
        const generatedCUIL = generateCUILFromDNI(numericDNI, prefix);
        if (data.cuil === generatedCUIL) return;
        if (personNested) {
            setFormData(prev => ({
                ...prev,
                person: {
                    ...prev.person,
                    dni: numericDNI,
                    cuil: generatedCUIL
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                dni: numericDNI,
                cuil: generatedCUIL
            }));
        }
    }, [
        formData,
        setFormData,
        personNested
    ]);
}; */

/* export const useDNIEffect = ({ formData, setFormData }) => {
    const dni = formData.person?.dni;
    const gender = formData.person?.gender;

    useEffect(() => {
        // Si no hay DNI, limpiar CUIL
        if (!dni) {
            setFormData(prev => {
                if (prev.person?.cuil === "") return prev;
                return {
                    ...prev,
                    person: {
                        ...prev.person,
                        cuil: ""
                    }
                };
            });
            return;
        };
        const dniNumber = Number(dni);
        // DNI inválido
        if (Number.isNaN(dniNumber) || dniNumber <= 0) {
            return;
        };
        // Obtener prefijo según género
        const prefix = getCUILPrefixByGender(gender);
        // Todavía no se puede generar el CUIL
        if (prefix === null) {
            return;
        };
        const generatedCUIL = generateCUILFromDNI(dniNumber, prefix);
        // DNI fuera del rango válido
        if (!generatedCUIL) {
            return;
        };
        // Evitar actualizar el estado innecesariamente
        if (formData.person?.cuil === generatedCUIL) {
            return;
        };
        setFormData(prev => ({
            ...prev,
            person: {
                ...prev.person,
                cuil: generatedCUIL
            }
        }));
    }, [dni, gender, setFormData, formData.person?.cuil]);
}; */

export const useDNIEffect = ({ formData, setFormData }) => {

    // ============================================================
    // DETECTAR ESTRUCTURA DEL FORMULARIO
    // ============================================================
    // UsersForm:
    // formData.person.dni
    // formData.person.gender
    // formData.person.cuil
    //
    // PeopleForm:
    // formData.dni
    // formData.gender
    // formData.cuil
    // ============================================================

    const isPersonNested = !!formData?.person;

    const data = isPersonNested
        ? formData.person
        : formData;

    const dni = data?.dni;
    const gender = data?.gender;
    const currentCuil = data?.cuil;

    useEffect(() => {

        // ============================================================
        // SI NO HAY DNI -> LIMPIAR CUIL
        // ============================================================

        if (!dni) {
            setFormData(prev => {

                if (isPersonNested) {

                    if (prev.person?.cuil === "") {
                        return prev;
                    }

                    return {
                        ...prev,
                        person: {
                            ...prev.person,
                            cuil: ""
                        }
                    };
                }

                if (prev.cuil === "") {
                    return prev;
                }

                return {
                    ...prev,
                    cuil: ""
                };
            });

            return;
        }

        // ============================================================
        // CONVERTIR DNI A NUMBER
        // ============================================================

        const dniNumber = Number(dni);

        if (Number.isNaN(dniNumber) || dniNumber <= 0) {
            return;
        }

        // ============================================================
        // OBTENER PREFIJO SEGÚN GÉNERO
        // ============================================================

        const prefix = getCUILPrefixByGender(gender);

        // Todavía no tenemos género válido
        if (prefix === null) {
            return;
        }

        // ============================================================
        // GENERAR CUIL
        // ============================================================

        const generatedCUIL = generateCUILFromDNI(
            dniNumber,
            prefix
        );

        // DNI fuera del rango válido
        if (!generatedCUIL) {
            return;
        }

        // ============================================================
        // EVITAR ACTUALIZACIONES INNECESARIAS
        // ============================================================

        if (currentCuil === generatedCUIL) {
            return;
        }

        // ============================================================
        // ACTUALIZAR CUIL
        // ============================================================

        setFormData(prev => {

            // --------------------------------------------------------
            // USERS FORM
            // --------------------------------------------------------

            if (isPersonNested) {
                return {
                    ...prev,
                    person: {
                        ...prev.person,
                        dni: dniNumber,
                        cuil: generatedCUIL
                    }
                };
            }

            // --------------------------------------------------------
            // PEOPLE FORM
            // --------------------------------------------------------

            return {
                ...prev,
                dni: dniNumber,
                cuil: generatedCUIL
            };
        });

    }, [
        dni,
        gender,
        currentCuil,
        isPersonNested,
        setFormData
    ]);
};