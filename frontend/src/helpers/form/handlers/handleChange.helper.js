import { generateCUILFromDNI } from "../../generateCUILFromDNI.helper";
import { numberFields } from "../constants.form.helper";
import { setNestedValue } from "../nested.form.helper";
import { normalizeNumber } from "../normalization.form.helper";

export const createHandleChange = ({ setFormData, setTouched }) => {
    return (e, lang) => { 
        const { name, value, type, checked } = e.target;
        //Specified Checkbox or normal Input
        let finalValue = type === "checkbox" ? checked : value;
        
        //Number Fields:
        if(numberFields.some(field => name.startsWith(field))) finalValue = normalizeNumber(finalValue);

        //Save the touched:
        const touchedKey = lang ? `${name}.${lang}`: name;
        setTouched(prev => ({ ...prev, [touchedKey]: true }));

        //Update the state:
        setFormData(prev => {
            let updated;
            //CASE: price + language:
            if(lang && name.includes(".")) {
                const [parent, child] = name.split(".");
                updated = { ...prev, [parent]: { ...prev[parent], [child]: { ...prev[parent]?.[child], [lang]: finalValue }}};
            }
            
            //CASE: Normal field anidate (example: person.name):
            else if(name.includes(".")) {
                updated = setNestedValue(prev, name, finalValue);
            }

            //CASE: Simple with lang (example: name: { es: "Charlie" }) :
            else if (lang) {
                updated = { ...prev, [name]: { ...prev[name], [lang]: finalValue}};
            }

            //CASE: Simple normal:
            else { updated = { ...prev, [name]: finalValue }; };

            //DNI with automatic CUIL:
            if(name === "dni") {
                const dni = Number(finalValue);
                updated.cuil = !isNaN(dni) && dni > 0 ? generateCUILFromDNI(dni, 27): "";
            };

            //DNI Anitadte (example: person.dni):
            if(name === "person.dni") {
                const dni = Number(finalValue);
                const cuil = !isNaN(dni) && dni > 0 ? generateCUILFromDNI(dni, 27): "";
                updated = { ...updated, person: { ...updated.person, cuil }};
            };
            
            return updated;
        });
    };
};