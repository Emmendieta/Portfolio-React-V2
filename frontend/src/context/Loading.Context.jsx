import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);
    const startLoading = () => { setLoadingCount((prev) => prev + 1); };
    const stopLoading = () => { setLoadingCount((prev) => Math.max(prev - 1, 0)); };
    const isLoading = loadingCount > 0;

    return (<LoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>{children}</LoadingContext.Provider>);
};

export const useLoading = () => useContext(LoadingContext);