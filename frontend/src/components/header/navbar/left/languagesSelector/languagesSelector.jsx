import { AR, US } from 'country-flag-icons/react/3x2';
import { useLanguage } from '../../../../../context/Language.Context';
import { useState } from 'react';
import "./languagesSelector.css";

const LANGUAGES = { 
    es: { label: "ES", Flag: AR },
    en: { label: "EN", Flag: US },
};

function LanguagesSelector() {
    const { language, changeLanguage } = useLanguage();
    const [ open, setOpen ] = useState(false);

    const CurrentFlag = LANGUAGES[language].Flag;

    return (
        <div className='langDropdown'>
            <button className='btn btn.dark dropdown-toggle' type='button' onClick={() => setOpen(!open)} >
                <CurrentFlag id="langSelectCurrentFlag" />{LANGUAGES[language].label}
            </button>
            <ul className={`dropdown-menu${open ? " show": ""}`}>
                {Object.entries(LANGUAGES).map(([key, { label, Flag }]) => (
                    <li key={key}>
                        <button className='dropdown-item langFlagBtn' onClick={() => {
                            changeLanguage(key);
                            setOpen(false);
                        }}><Flag  id='langSelectFlag' />{label}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LanguagesSelector;