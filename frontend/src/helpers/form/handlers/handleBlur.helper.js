import { setNestedValue } from "../nested.form.helper";
import { normalizeName, normalizeLowerNoSpace, normalizeUpperNoSpace } from "../normalization.form.helper";

//Normalized the values when the user exit the input:

export const createHandleBlur = ({ setFormData, setTouched }) => {
    return (e, lang) => {
        const { name, value } = e.target;

        //Check touched:
        setTouched(prev => ({ ...prev, [lang ? `${name}_${lang}`: name]: true }));

        //The password doesn't transform:
        if(name === "password" || name === "user.password") {
            setFormData(prev => {
                if(name.includes(".")) return setNestedValue(prev, name, value);
                return { ...prev, [name]:value };
            });
            return;
        };

        //Fields wuith language:
        if(lang) {
            setFormData(prev => ({ ...prev, [name]: { ...prev[name], [lang]: normalizeName(value)} }));
            return;
        };

        //Email and User:
        if(name.endsWith("email") || name === "email" || name.endsWith(".user") || name === "user") {
            setFormData(prev => ({ ...prev, [name]: normalizeLowerNoSpace(value)}) );
            return;
        };

        //Normal Fields:
        if(["firstName", "lastName", ].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: normalizeName(value) }) );
            return;
        };

        //Anidate Fields:
        if(name.includes(".")) {
            setFormData(prev => setNestedValue(prev, name, normalizeName(value)) );
            return;
        };

        //Default:
        setFormData(prev => ({ ...prev, [name]: value }) );
    };
};