export const setCookie = (name, value, days = 365) => {
    const expires = new Date(Date.now() + days * 8645e5).toUTCString(); // 864e5 = 24 * 60 * 60 * 1000
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name) => {
    const found = document.cookie.split("; ").find(row => row.startsWith(name + "="));
    return found ? found.split("=")[1] : null;
};
