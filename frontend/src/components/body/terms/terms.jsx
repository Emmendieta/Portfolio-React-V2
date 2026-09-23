import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../context/Language.Context";
import H1Fields from "../generalFields/h1Fields/h1fields";
import H2Fields from "../generalFields/h2Fields/h2Fields";
import "./terms.css";

function Terms() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="termsCont">
            <section className="termsSectCont">
                <H1Fields value={`${TEXT.TERM_COND_USE}`} language={language}
                    clH1Cont="termsH1Cont" clH1Text="termsH1" />
                <H2Fields value={`${TEXT.LAST_UPDATE} ${TEXT.DATE_UPDATE}`} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <p className="termsP">{TEXT.WELCOME_TO} <strong><a href="https://www.emmendieta.com">emmendieta.com</a></strong> ({TEXT.THE_WEBSITE}). {TEXT.ACCEPTING_WEB}</p>
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.PURPOSE}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.PUPROSE_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.INTELLECTUAL_PROPERTY}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.INTELLECTUAL_PROPERTY_EXP_1} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <H2Fields value={TEXT.INTELLECTUAL_PROPERTY_EXP_2} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.ACCEPTABLE_USE}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.ACCEPTABLE_USE_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <ul className="termsUl">
                    <li className="termsLi">{TEXT.ACCEPTABLE_USE_LI_1}</li>
                    <li className="termsLi">{TEXT.ACCEPTABLE_USE_LI_2}</li>
                    <li className="termsLi">{TEXT.ACCEPTABLE_USE_LI_3}</li>
                </ul>
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.ACCURACY_INFO}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.ACCURACY_INFO_EXP_1} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <H2Fields value={TEXT.ACCURACY_INFO_EXP_2} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.THIRD_PARTY}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.THIRD_PARTY_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.LIMITATION_LIABILITY}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.LIMITATION_LIABILITY_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.CONTACT_FORM}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.CONTACT_FORM_EXP_1} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <H2Fields value={TEXT.CONTACT_FORM_EXP_2} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.PRIVACY}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.PRIVACY_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.CHANGE_TERMS}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.CHANGE_TERMS_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.GOV_LAW}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.GOV_LAW_EXP} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={`${TEXT.CONTACT_TERMS}:`} language={language}
                    className="termsH2Cont" classNameH2="termsH2Title" />
                <H2Fields value={TEXT.CONTACT_EXP_1} language={language}
                    className="termsH2Cont" classNameH2="termsH2" />
                <p className="termsP">Email:{" "} <a href="mailto:emmendieta12@gmail.com">emmendieta12@gmail.com</a></p>
            </section>
        </div>
    );
};

export default Terms;