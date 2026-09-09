//EMAIL:

export function validatorEmail(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    if(/\s/.test(value)) throw new Error(textErr);
    const trimmed = value.trim();
    const regex = /^[a-z0-9]+([._-][a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
    if(!regex.test(trimmed)) throw new Error(textErr);
    return true;
};

export function isValidEmail(value) {
    if(typeof value !== "string") return false;
    if(/\s/.test(value)) return false;
    const trimmed = value.trim();
    const regex = /^[a-z0-9]+([._-][a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
    return regex.test(trimmed);
};


//PASSWORD:

export function validatorPassword(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    if(/\s/.test(value)) throw new Error(textErr);
    if(value.length < 8) throw new Error(textErr);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]+$/;
    if(!regex.test(value)) throw new Error(textErr);
    return true;
};

export function isValidPassword(value) {
    if(typeof value !== "string") return false;
    if(/\s/.test(value)) return false;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(value);
};


//NAME:

export function validatorName(value, textErr) {
    if (typeof value !== "string") throw new Error(textErr);
    const trimmed = value.trim();
    if (trimmed.length <= 2 || trimmed.length >= 50) throw new Error(textErr);
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    if (!regex.test(trimmed)) throw new Error(textErr);
    return true;
};

//ZIP CODE:

export function validatorZipCode(value, textErr) {
    try {
        if (typeof value !== "string") throw new Error(textErr);
        const trimmed = value.trim();
        if (trimmed.length === 0) throw new Error(textErr);
        if (trimmed.length < 3 || trimmed.length > 12) throw new Error(textErr);
        const regex = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,11}[A-Za-z0-9]$/;
        if (!regex.test(trimmed)) throw new Error(textErr);
        return true;
    } catch (error) {
        throw error;
    }
};

//KEY:

export function validatorKey(value, textErr) {
    if (!value || typeof value !== "string") throw new Error(textErr)
    const key = value.toLowerCase();
    const pattern = /^(create|read|update|delete)_[a-z]+(_[a-z]+)*$/;
    if (!pattern.test(key)) throw new Error(textErr);
    return true;
};

//DATE

export function validatorDate(value, options = {}, textErDateEmpty, textErFormat, textErInvalid, textErFuture, textErOld) {
    if (!value) throw new Error(textErDateEmpty);
    const { allowFuture = false, maxYearsAgo = 120, } = options;
    let date;
    if (value instanceof Date) { date = value; }
    else if (typeof value === "string") {
        /* if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(textErFormat);
        date = new Date(value + "T00:00:00"); */
        // Aceptar YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            date = new Date(value + "T00:00:00");
        }
        // Aceptar DD/MM/YY o DD/MM/YYYY
        else if (/^\d{2}\/\d{2}\/\d{2,4}$/.test(value)) {
            const [dd, mm, yy] = value.split("/");
            let yyyy = yy.length === 2 ? (Number(yy) > 50 ? `19${yy}` : `20${yy}`) : yy;
            date = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
        }
        else throw new Error(textErFormat);
    } else throw new Error(textErInvalid);
    if (isNaN(date.getTime())) throw new Error(textErInvalid);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!allowFuture && date > today)  throw new Error(textErFuture);
    if (maxYearsAgo) {
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - maxYearsAgo);
        if (date < minDate) throw new Error( `${textErOld} ${maxYearsAgo} years` );
    };
    return true;
};

//CUIL CUIT:

export function validatorCUILCUIT(value, textErr) {
    if (!/^\d{11}$/.test(value)) throw new Error(textErr);
    const pre = Number(value.slice(0, 2));
    const digit = Number(value.slice(10));
    const preDigitsValid = [20, 23, 27, 30, 33, 34];
    if (!preDigitsValid.includes(pre)) throw new Error(textErr);
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let plus = 0;
    for (let i = 0; i < factors.length; i++) {
        plus += Number(value[i]) * factors[i];
    };
    let left = plus % 11;
    let calculateDigit = 11 - left;
    if (calculateDigit === 11) calculateDigit = 0;
    if (calculateDigit === 10) calculateDigit = 9;
    if (digit !== calculateDigit) throw new Error(textErr);
    return true;
};

//DNI CUIL CUIT:

export function validDNICUILCUITL(value, type) {
    if (type === "DNI") return validatorDNI(value);
    if (type === "CUIL" || type === "CUIT") return validatorCUILCUIT(value);
    throw new Error("Invalid document type!");
};


//PHONE

export function validatorPhone(value, textErr) {
    if (value === null || value === undefined) throw new Error(textErr);
    const str = String(value).trim();
    if (str.length === 0) throw new Error(textErr);
    if (!/^\d+$/.test(str)) throw new Error(textErr);
    if (!/^[1-9]\d{7,14}$/.test(str)) throw new Error(textErr);
    return true;
};

//DNI:

export function validatorDNI(value, textErr) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) throw new Error(textErr);
    if(!Number.isInteger(numberValue)) throw new Error(textErr);
    if (numberValue <= 100000 || numberValue >= 99999999) throw new Error(textErr);
    return true;
};

//ALPHA NUMERIC:

export function validatorAlphaNumeric(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    const trimmed = value.trim();
    if(trimmed.length <= 2 || trimmed.length >= 50) throw new Error(textErr);
    const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]+)*$/;
    if(!regex.test(trimmed)) throw new Error(textErr);
    return true;
};

//NUMBER:

export function validatorNumber(value, textErr) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) throw new Error(textErr);
    if (numberValue < 0) throw new Error(textErr);
    return true;
};

//PERCENT:

export function validatorPercent(value, textErr) {
    const numberValue = Number(value);
    if(isNaN(numberValue)) throw new Error(textErr);
    if(numberValue < 0 || numberValue > 100) throw new Error(textErr);
    return true;
};


//USERS:

export function validatorUser(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    if(/\s/.test(value)) throw new Error(textErr);
    const trimmed = value.trim();
    if(!/^[a-z0-9]+$/.test(trimmed)) throw new Error(textErr)
};

//URL:

export function validatorURL(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    const trimmed = value.trim();
    if(!trimmed) throw new Error(textErr);
    try {
        const url = new URL(trimmed);
        if(!["http:", "https:"].includes(url.protocol)) { throw new Error(textErr); };
    } catch (error) { throw error; }  
    return true;   
};

//LONG TEXT:

export function validatorLongText(value, textErr) {
    if(typeof value !== "string") throw new Error(textErr);
    const trimmed = value.trim();
    if(trimmed.length <= 2) throw new Error(textErr);
    return true;
};

