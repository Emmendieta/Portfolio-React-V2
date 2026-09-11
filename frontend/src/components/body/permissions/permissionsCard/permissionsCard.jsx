import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function PermissionCard({ permission, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible,setVisible] = useState(false);
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const [canEdit, setCanEdit] = useState(false);
    const [canDetails, setCanDetails] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1, } );
        const currentRef = cardRef.current;
        if(currentRef) observer.observe(currentRef);
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
                verifyPrivileges(user, "update_permissions"),
                verifyPrivileges(user, "details_permissions"),
                verifyPrivileges(user, "delete_permissions"),
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={permission._id} className={`generalCardColumn ${visible ? 'fade-in': ""}`}>
            <div id="generalCardBodyColumn">
                <H2Fields label={TEXT.ID} value={permission._id} className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
                <H2Fields label={TEXT.KEY} value={permission.key} className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
                <H2Fields label={TEXT.NAME} value={permission.name?.[language] || ""} className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
            </div>
            <div id="generalCardDescriptionColumn">
                EL DESCRIPTION CAMBIAR POR UN TEXTO MAS LARGO 
                <H2Fields label={TEXT.DESCRIPTION} value={permission.description?.[language] || ""}className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
            </div>
            {(canEdit || canDetails || canDelete) && (
                <div id="generalCardBtnsColumn">
                    {canDetails && (
                        <button className="btn btn-outline-success" id="generalCardBtnDetails" onClick={() => navigate(`/permissions/detail/${permission._id}`, { state: { permission }})}><BiSolidUserDetail className="iconBtnGeneralDetail"/></button>
                    )}
                    {canEdit && (
                        <button className="btn btn-outline-primary" id="generalCardBtnEdit" onClick={() => navigate(`/permissions/form/${permission._id}`, { state: { permission }})}><FaUserEdit className="iconBtnGeneralEdit"/></button>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger" id="generalCardBtnDelete" onClick={() => onDelete(permission._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PermissionCard;