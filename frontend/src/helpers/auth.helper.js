const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OPTS_POST = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
};

const OPTS_GET = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
};

const OPTS_POST_WITH_BODY = (data) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
});

const getCurrentUser = async () => {
    try {
        const url = `${BACKEND_URL}/auth/current`;
        const response = await fetch(url, OPTS_GET);
        const data = await response.json();
        if(!response.ok || data.error) return { user: null, error: true };
        return { user: data.response ?? null, error: false };
    } catch (error) {
        console.error("Error: ", error.message);
        return { error: true };
    }
};

const loginUser = async (email, password) => {
    try {
        const url = `${BACKEND_URL}/auth/login`;
        const payload = { email, password };
        const response = await fetch(url, OPTS_POST_WITH_BODY(payload));
        const data = await response.json();
        if(!response.ok || data.error) return { user: null, error: true, message: data?.error?.message || "Login Fail!" };
        return { user: data.response, error: false };
    } catch (error) {
        console.error("Error: ", error.message);
        return { error: true };
    }
};

const signOutUser = async () => {
    try {
        const url = `${BACKEND_URL}/auth/signout`;
        const response = await fetch(url, OPTS_POST);
        const data = await response.json();
        if(!response.ok || data.error) return { user: null, error: true, message: data?.error?.message || "Singout Fail!"};
        return data;
    } catch (error) {
        console.error("Error: ", error.message);
        return { error: true };
    }
};

export { getCurrentUser, signOutUser, loginUser };