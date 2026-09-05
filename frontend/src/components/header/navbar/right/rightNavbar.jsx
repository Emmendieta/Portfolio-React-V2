import { useContext } from "react";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLanguage } from "../../../../context/Language.Context";
import { UserContext } from "../../../../context/User.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { signOutUser } from "../../../../helpers/auth.helper";
import { Link } from "react-router-dom";
import "./rightNavbar.css";

function RightNavbar () {
    const { user, loadingUser } = useContext(UserContext);
    const { successSweet, errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

    const handleSignOut = async () => {
        try {
            const result = await signOutUser();
            if(result?.error) {
                console.error(TEXT.ERROR_SIGN_OUT, result?.error.message);
                await errorSweet(TEXT.ERROR_SIGN_OUT);
            };
            await successSweet(TEXT.SIGN_OUT_SUCCESS);
            window.location.reload();
        } catch (error) {
            console.error(TEXT.ERROR, error.message);
            await errorSweet(TEXT.ERROR);
        }
    };

    return (
        <div className="rightNavCont">
            <Link to="/pdf/export-view" className="btn btn-outline-success" id="btnNavbarCurriculum">{TEXT.CURRICULUM}</Link>
            {!loadingUser && (
                user ? (
                    <div className="rightNavLoginCont">
                        <Link to="/profile" className="btn btn-outline-success" id="btnNavbarProfile">{TEXT.PROFILE}</Link>
                        <button className="btn btn-outline-danger" onClick={handleSignOut} id="btnNavbarSignOut">{TEXT.SIGN_OUT}</button>
                    </div>
                ): (
                    <div className="rightNavLoginCont"> 
                        <Link to="/login" className="btn btn-outline-success" id="btnNavbarLogin">{TEXT.LOGIN}</Link>
                    </div>
                )
            )}
        </div>
    );
};

export default RightNavbar;