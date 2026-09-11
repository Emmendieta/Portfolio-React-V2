import { useEffect } from "react"
import { generateCUILFromDNI } from "../../generateCUILFromDNI.helper";

export const useDNIEffect = ({ formData, setFormData }) => {
    
    useEffect(() => {
        //If DNI no exist, don't do nothing:
        if(!formData.dni) return;
        const numericDNI = Number(formData.dni);
        if(!isNaN(numericDNI) && numericDNI > 0) {
            const generatedCUIL = generateCUILFromDNI(numericDNI, 27);
            //Evitamos renders innecesarios:
            if(formData.cuil !== generatedCUIL) { setFormData(prev => ({ ...prev, dni: numericDNI, cuil: generatedCUIL }) ) };
        }; 
    }, [formData.dni]);
};