import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { FaArrowRightToCity, FaRegTrashCan } from "react-icons/fa6";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ResponsibilitiesCard({ responsibility, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { setVisible(entry.isIntersecting); });
        }, { threshold: 0.1 } );
        const currentRef = cardRef.current;
        if(currentRef) observer.observe(currentRef);
        return () => { if(currentRef) observer.unobserve(currentRef); };
    }, []);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanEdit(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_responsibilites"),
                verifyPrivileges(user, "create_responsibilities")
            ]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={responsibility._id} className={`generalCardRow ${visible ? 'fade-in': ""}`}>
            <div className="">
                <H2Fields label={TEXT.ID} value={responsibility._id} className="" classNameLabel="" classNameH2="" language={language} />
                <H2Fields label={TEXT.NAME} value={responsibility.name?.[language] || ""} className="" classNameH2="" classNameLabel="" language={language} />
            </div>
            {(canEdit || canDelete) && (
                <div>
                    {canEdit && (
                        <button className="btn btn-outline-primary" id="ff" onClick={() => navigate(`/responsibilities/form/${responsibility._id}`)}><FaArrowRightToCity /></button>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger" id="ff" onClick={() => onDelete(responsibility._id)}><FaRegTrashCan /></button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResponsibilitiesCard;