import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { FaArrowRightToCity, FaRegTrashCan } from "react-icons/fa6";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function CitiesCard({ city, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(()=> {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1, } );
        const currentRef = cardRef.current;
        if(currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanEdit(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, deleteAllowed] = await Promise.all([verifyPrivileges(user, "edit_cities"), verifyPrivileges(user, "delete_cities")]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={city._id} className={`citCardRow ${visible ? 'fade-in': ""}`}>
            <div id="citCardBodyRow">
                <H2Fields label={TEXT.ID} value={city._id} className={"citCardH2FieldsRow"} classNameLabel={"citCardH2FieldsRowLabel"} classNameH2={"citCardH2FieldsRowH2"} language={language} />
                <H2Fields label={TEXT.NAME} value={city.name?.[language] || ""} className={"citCardH2FieldsRow"} classNameLabel={"citCardH2FieldsRowLabel"} classNameH2={"citCardH2FieldsRowH2"} language={language} />
                <H2Fields label={TEXT.ZIP_CODE} value={city.zipCode} className={"citCardH2FieldsRow"} classNameLabel={"citCardH2FieldsRowLabel"} classNameH2={"citCardH2FieldsRowH2"} language={language} />
            </div>
            {(canEdit || canDelete) && (
            <div id="citCardBtnsRow">
                {canEdit && (
                    <button className="btn btn-outline-primary" id="citCardBtnEdit" onClick={() => navigate(`/cities/form/${city._id}`, { state: { city }})}><FaArrowRightToCity className="iconBtnGeneralEdit"/></button>
                )}
                {canDelete && (
                    <button className="btn btn-outline-danger" id="citCardBtnDelete" onClick={() => onDelete(city._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                )}
            </div>
            )}
        </div>
    );
};

export default CitiesCard;