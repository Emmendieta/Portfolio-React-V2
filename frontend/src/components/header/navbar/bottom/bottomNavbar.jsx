import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import "./bottomNavbar.css";

function BottomNavbar() {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <div className="bottomNavCont">
            <section className="bottomNavTop">
                <a href="/#person" className="bottonNavLink" >{TEXT.PERSON}</a>
                <a href="/#educations" className="bottonNavLink" >{TEXT.EDUCATIONS}</a>
                <a href="/#works" className="bottonNavLink" >{TEXT.WORKS}</a>
                <a href="/#skills" className="bottonNavLink" >{TEXT.SKILLS}</a>
                <a href="/#proyects" className="bottonNavLink" >{TEXT.PROYECTS}</a>
            </section>
            <section className="bottomNavBottom">
                <div className="bottomNavBottomDiv"></div>
            </section>
        </div>
    );
};

export default BottomNavbar;