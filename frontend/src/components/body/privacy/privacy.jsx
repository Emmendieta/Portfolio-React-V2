import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../context/Language.Context";
import H1Fields from "../generalFields/h1Fields/h1fields";
import H2Fields from "../generalFields/h2Fields/h2Fields";
import "./privacy.css";

function Privacy() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="privCont">
            <section className="privSectCont">
                <H1Fields value={TEXT.PRIVACY_2} language={language}
                    clH1Cont="" clH1Text="" />
                <H2Fields value={`${TEXT.LAST_UPDATE} ${TEXT.DATE_UPDATE}`} language={language}
                    className="" classNameH2="" />
                <H2Fields value={`${TEXT.WELCOME_TO} https://www.emmendieta.com/`} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.INFO_COLLECT} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.INFO_COLLECT_EXP} language={language}
                className="" classNameH2="" />
                <ul className="privUl">
                    <li className="privLi">{TEXT.INFO_COLLECT_EXP_LI_1}</li>
                    <li className="privLi">{TEXT.INFO_COLLECT_EXP_LI_2}</li>
                    <li className="privLi">{TEXT.INFO_COLLECT_EXP_LI_3}</li>
                </ul>
                <H2Fields value={TEXT.INFO_COLLECT_EXP_2} language={language}
                className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.HOW_USE_INFO} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.HOW_USE_INFO_EXP} language={language}
                className="" classNameH2="" />
                <ul className="privUl">
                    <li className="privLi">{TEXT.HOW_USE_INFO_EXP_LI_1}</li>
                    <li className="privLi">{TEXT.HOW_USE_INFO_EXP_LI_2}</li>
                    <li className="privLi">{TEXT.HOW_USE_INFO_EXP_LI_3}</li>
                </ul>
                <H2Fields value={TEXT.HOW_USE_INFO_EXP_2} language={language}
                className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.CONTACT_FORM_PRO} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_FOR_PRO_EXP} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_FOR_PRO_EXP_2} language={language}
                className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.THIRD_PARTY_SER} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.THIRD_PARTY_SER_EXP} language={language}
                className="" classNameH2="" />
                <ul className="privUl">
                    <li className="privLi">{TEXT.THIRD_PARTY_SER_EXP_LI_1}</li>
                    <li className="privLi">{TEXT.THIRD_PARTY_SER_EXP_LI_2}</li>
                    <li className="privLi">{TEXT.THIRD_PARTY_SER_EXP_LI_3}</li>
                </ul>
                <H2Fields value={TEXT.THIRD_PARTY_SER_EXP_2} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.COOKIES} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.COOKIES_EXP} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.COOKIES_EXP_2} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.THIRD_PARTY_LINKS} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.THIRD_PARTY_LINKS_EXP} language={language}
                className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.DATA_SECURITY} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.DATA_SECURITY_EXP} language={language}
                className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.YOUR_RIGHTS} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.YOUR_RIGHTS_EXP} language={language}
                className="" classNameH2="" />
                <H2Fields value={TEXT.YOUR_RIGHTS_EXP_1} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.CHANGE_PRIVACY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CHANGE_PRIVACY_EXP} language={language}
                    className="" classNameH2="" />
            </section>
            <section className="privSectCont">
                <H2Fields value={TEXT.CONTACT_PRIVACY} language={language}
                    className="" classNameH2="" />
                <H2Fields value={TEXT.CONTACT_PRIVACY_EXP} language={language}
                    className="" classNameH2="" />
                <p className="terms_p">Email: {" "} <a href="mailto:emmendieta12@gmail.com">emmendieta12@gmail.com</a></p>
            </section>
        </div>
    );
};

export default Privacy;