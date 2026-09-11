export function generateCUILFromDNI(dni, prefix = 20) {
    const numberDNI = Number(dni);
    if(isNaN(numberDNI) || numberDNI < 100000 || numberDNI > 99999999) return "";
    const dniStr = String(numberDNI).padStart(8, "0");
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let plus = 0;
    const fullNumber = prefix.toString().padStart(2, "0") + dniStr;
    for (let i = 0; i < factors.length; i++) { plus += Number(fullNumber[i]) * factors[i]; };
    let left = plus % 11;
    let calculateDigit = 11 - left;
    if (calculateDigit === 11) calculateDigit = 0;
    if (calculateDigit === 10) calculateDigit = 9;
    return `${prefix}${dniStr}${calculateDigit}`;
};