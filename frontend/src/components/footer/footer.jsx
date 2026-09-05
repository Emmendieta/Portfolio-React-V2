import { Link } from "react-router-dom";
import { LANG_CONST } from "../../constants/SelectLang.Constant";
import { useLanguage } from "../../context/Language.Context";
import { useRefresh } from "../../context/Refresh.Context";
import H1Fields from "../body/generalFields/h1Fields/h1fields";
import H2Fields from "../body/generalFields/h2Fields/h2Fields";
import Contacts from "./contacts/contacts";
import SocialMedias from "./socialMedias/socialMedias";
import NewSocialMediaContact from "./newSocialMediaContact/newSocialMediaContact";
import { useEffect } from "react";
import { useState } from "react";
import { fetchGetAllSocials } from "../body/socials/socialsLogic";
import "./footer.css";

function Footer() {
    const [socials, setSocials] = useState([]);
    const [contacts, setContacts] = useState([]);
    const { refreshKey } = useRefresh();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    useEffect(() => {
        const loadSocials = async () => {
            try {
                const result = await fetchGetAllSocials();
                if(!result || result?.response?.error) {
                    setSocials([]);
                    setContacts([]);
                    return;
                    //FALTA SWEET
                };
                const socialsNetworks = result.response || [];
                setContacts(socialsNetworks.filter(contact => contact.typeSocial === "Contact") || []);
                setSocials(socialsNetworks.filter(social => social.typeSocial === "Social") || []);
            } catch (error) {
                //FALTA ERROR
            }
        };
        loadSocials();
    }, [language]);

    return (
        <div id="ftDivCont">
            <section id="ftDivLineCont"></section>
            <section id="ftSocialSectAddCont">
                <NewSocialMediaContact />
            </section>
            <section id="ftDivMiddleCont">
                <div className="ftDivMiddleLeft">
                    <Contacts refreshKey={refreshKey} contacts={contacts} />
                </div>
                <div className="ftDivMiddleMidd">
                    <H1Fields value={TEXT.MENDIETA_EMILIANO} language={language}
                        clH1Cont="ftH1Cont"  clH1Text="ftH1Text"/>
                </div>
                <div className="ftDivMiddleRigth">
                    <SocialMedias refreshKey={refreshKey} socials={socials} />
                </div>
            </section>
            <section id="ftDivBottomCont">
                <H2Fields value={TEXT.COPY_RIGHT} language={language}
                    className="ftBottomH2Cont" classNameH2="ftBottomH2Text"/> 
            </section>
        </div>
    );
};

export default Footer;