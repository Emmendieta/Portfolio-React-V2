import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbWorldCog, TbWorldSearch } from "react-icons/tb";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ContinentCard({ continent, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const [canEdit, setCanEdit] = useState(false);
    const [canDetails, setCanDetails] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1 } );
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanEdit(false);
                setCanDetails(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, detailsAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "edit_continents"),
                verifyPrivileges(user, "details_continents"),
                 verifyPrivileges(user, "delete_continents")]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={continent._id} className={`generalCardRow ${visible ? 'fade-in' : ""}`}>
            <div id="generalCardBodyRow">
                <H2Fields label={TEXT.ID} value={continent._id} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
                <H2Fields label={TEXT.NAME} value={continent.name?.[language] || ""} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
            </div>
            {(canEdit || canDetails || canDelete) && (
            <div id="generalCardBtnsRow">
                {canDetails && (
                    <button className="btn btn-outline-success" id="generalCardBtnDetails" onClick={() => navigate(`/continents/detail/${continent._id}`, { state: { continent } })}><TbWorldSearch className="iconBtnGeneralDetail" /></button>
                )}
                {canEdit && (
                    <button className="btn btn-outline-primary" id="generalCardBtnEdit" onClick={() => navigate(`/continents/form/${continent._id}`, { state: { continent } })}><TbWorldCog className="iconBtnGeneralEdit" /></button>
                )}
                {canDelete && (
                    <button className="btn btn-outline-danger" id="generalCardBtnDelete" onClick={() => onDelete(continent._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                )}
            </div>
            )}
        </div>
    )
};

export default ContinentCard;