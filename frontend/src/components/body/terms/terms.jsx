import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../context/Language.Context";
import H1Fields from "../generalFields/h1Fields/h1fields";
import H2Fields from "../generalFields/h2Fields/h2Fields";

function Terms() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="termsCont">
            <section className="termsSectCont">
                <H1Fields value={TEXT.TERM_COND_USE} language={language}
                    clH1Cont="" clH1Text="" />
                <H2Fields value={`${TEXT.LAST_UPDATE} ${TEXT.DATE_UPDATE}`} language={language}
                    className="" classNameH2="" />
                <p className="terms_p">{TEXT.WELCOME_TO} <strong><a href="https://www.emmendieta.com">emmendieta.com</a></strong> ({TEXT.THE_WEBSITE}). {TEXT.ACCEPTING_WEB} COREGIR EL TIPO EN H2FIELDS</p>
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.PURPOSE} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.PURPOSE_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.INTELLECTUAL_PROPERTY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.INTELLECTUAL_PROPERTY_EXP_1} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.INTELLECTUAL_PROPERTY_EXP_2} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.ACEPTABLE_USE} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.ACEPTABLE_USE_EXP} language={language}
                    className="" classNameH2="" />
                <ul className="termsUl">
                    <li className="termsLi">{TEXT.ACEPTABLE_USE_LI_1}</li>
                    <li className="termsLi">{TEXT.ACEPTABLE_USE_LI_2}</li>
                    <li className="termsLi">{TEXT.ACEPTABLE_USE_LI_3}</li>
                </ul>
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.ACCURACY_INFO} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.ACCURACY_INFO_EXP_1} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.ACCURACY_INFO_EXP_2} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.THIRD_PARTY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.THIRD_PARTY_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.LIMITATION_LIABILITY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.LIMITATION_LIABILITY_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.CONTACT_FORM} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_FORM_EXP_1} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_FORM_EXP_2} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.PRIVACY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.PRIVACY_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.CHANGE_TERMS} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CHANGE_TERMS_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.GOV_LAW} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.GOV_LAW_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="termsSectCont">
                <H2Fields value={TEXT.CONTACT_TERM} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_EXP_1} language={language}
                    className="" classNameH2="" />
                <p className="terms_p">Email:{" "} <a href="mailto:emmendieta12@gmail.com">emmendieta12@gmail.com</a> CAMBIAR DSPUES POR H2FIELD</p>
            </section>
        </div>
    );
};

export default Terms;