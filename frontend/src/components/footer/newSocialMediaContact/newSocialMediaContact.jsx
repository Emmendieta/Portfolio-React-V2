import { useContext } from "react";
import { UserContext } from "../../../context/User.Context";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/Language.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";

function NewSocialMediaContact() {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    return (
        <Link to={"/socials/form/new"} >
            <button type="button" className="btn btn-outline-success">{`${TEXT.NEW_F} ${TEXT.SOCIAL}`}</button>
        </Link>
    );
};

export default NewSocialMediaContact;