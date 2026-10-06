import { useContext } from "react";
import { UserContext } from "../../../context/User.Context";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/Language.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useState } from "react";
import { userVerifyPrivileges } from "../../../helpers/privileges.helper";

function NewSocialMediaContact() {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_socials");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <>
            {canCreate && (
                <Link to={"/socials/form/new"} >
                    <button type="button" className="btn btn-outline-success">{`${TEXT.NEW_F} ${TEXT.SOCIAL}`}</button>
                </Link>
            )}
        </>
    );
};

export default NewSocialMediaContact;