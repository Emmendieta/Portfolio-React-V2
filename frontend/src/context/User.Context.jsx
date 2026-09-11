import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../helpers/auth.helper.js";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { user, error } = await getCurrentUser();
            if(error) {
                setLoadingUser(false);
                return;
            };
            setUser(user);
            setLoadingUser(false);
        };
        fetchUser();
    }, []);

    const logout = () => { setUser(null); };

    return ( <UserContext.Provider value = {{ user, loadingUser, setUser, logout }}>{ children }</UserContext.Provider> );
};