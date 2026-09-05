import { useContext } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useEffect } from "react";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { FaArrowRightToCity, FaRegTrashCan } from "react-icons/fa6";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function HabilitiesCard({ hability, onDelete }) {
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
        return () => { if (currentRef) observer.unobserve(currentRef); };
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
                verifyPrivileges(user, "update_habilities"),
                verifyPrivileges(user, "delete_privileges")
            ]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={hability._id} className={`generalCardRow ${visible ? 'fade-in': ""}`}>
            <div className="">
                <H2Fields label={TEXT.ID} value={hability._id} className={""} classNameLabel={""} classNameH2={""} language={language} />
                <H2Fields label={TEXT.NAME} value={hability.name?.[language] || ""} className={""} classNameLabel={""} classNameH2={""} language={language} />
            </div>
            {(canEdit || canDelete) && (
                <div>
                    {canEdit && (
                        <button className="btn btn-outline-primary" id="" onClick={() => navigate(`/habilities/form/${hability._id}`, { state: { hability } })}><FaArrowRightToCity /></button>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger" id="" onClick={() => onDelete(hability._id)}><FaRegTrashCan /></button>
                    )}
                </div>
            )}
        </div>
    );
};

export default HabilitiesCard;