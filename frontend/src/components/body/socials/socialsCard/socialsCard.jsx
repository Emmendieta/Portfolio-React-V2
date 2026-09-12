import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { Link, useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import Carousel from "../../generalFields/carousel/carousel";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import "./socialsCard.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SocialsCard({ social, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const socialsTranslations = [
        { value: "Social", label: { es: "Red Social", en: "Social Network" } },
        { value: "Contact", label: { es: "Contacto", en: "Contact" } }
    ];
    const socialTypeValue = socialsTranslations[social.typeSocial?.[language] || TEXT.ERROR_NO_TYPE_SOCIAL];
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanEdit(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_socials"),
                verifyPrivileges(user, "delete_socials")
            ]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={social._id} className="socialCard">
            <section className="socialCardCarouselCont">
                <Carousel type="social" id={social._id} images={social.images?.map(img => img.url) || []} width={45} height={45} showNextPrev={false}
                    clCont="" clImgCont="" clImg="socialCardImg" clDivImgCont="" clBtnPrev="" clBtnNext="" />
            </section>
            <section className="socialCardBodyCont">
                <H1Fields value={<a href={`${social.url}`} target="_blank" rel="noopener noreferrer"  className="socialCardH1A">{`${social.name || []}`}</a>} id={""} language={language} 
                    clH1Text ="socialCardH1"/>
            </section>
            {(canEdit || canDelete) && (
                <section className="socialCardBtnCont">
                    {canEdit && (
                        <Link to={`/socials/form/${social._id}`} id="socialCardEdit" className="btn btn-outline-primary btn-sm">
                            <FaPen />
                        </Link>
                    )}
                    {canDelete && (
                    <button className="btn btn-outline-danger btn-sm" id="socialCardDelete" onClick={() => onDelete(social._id)}>
                        <FaRegTrashCan />
                    </button>
                    )}
                </section>
            )}
        </div>
    );
};

export default SocialsCard;