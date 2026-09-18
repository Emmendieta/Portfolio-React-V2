import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './context/Language.Context.jsx'
import { LoadingProvider } from './context/Loading.Context.jsx'
import { ConfirmProvider } from './context/SweetAlert2.Context.jsx'
import "./main.css";
import TermsAndCond from './components/body/termsAndCond/termsAndCond.jsx'

createRoot(document.getElementById('root')).render(
    <LanguageProvider>
        <LoadingProvider>
            <ConfirmProvider>
                <TermsAndCond />
                <App />
            </ConfirmProvider>
        </LoadingProvider>
    </LanguageProvider>
);
