import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields//h2Fields";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Uls from "../../generalFields/Uls/Uls";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function RoleCard({ role, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const navigage = useNavigate();
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
                verifyPrivileges(user, "update_roles"),
                verifyPrivileges(user, "details_roles"),
                verifyPrivileges(user, "delete_roles")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);
    
    return (
        <div key={role._id} className={`generalCardColumn ${visible ? 'fade-in' : ""}`}>
            <div id="generalCardContainerColumn"> 
                <div id="generalCardBodyColumn"> 
                    <H2Fields label={TEXT.ID} value={role._id} className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
                    <H2Fields label={TEXT.NAME} value={role.role?.[language] || ""} className={"cardH2FieldsColumn"} classNameLabel={"cardH2FieldsColumnLabel"} classNameH2={"cardH2FieldsColumnH2"} language={language} />
                </div>
                <div id="generalCardBodyUlColumn">
                    {role.permissions?.length > 0 ? (
                        <Uls list={role.permissions}labelh1Field={""} valueH1Field={`${TEXT.PERMISSION_LIST}:`} language={language} classNameUl={"generalUlListGrid"} classnameli={"generalUlListRowLi"} idH1Field={"generalListH1"} renderItem={(permission) => (
                            <H2Fields label={`${TEXT.NAME} ${TEXT.PERMISSION}`} value={permission.name?.[language] || ""} className={"divH2CardUlCont"} classNameLabel={"divH2CardUlLabel"} language={language} />
                        )}
                        />
                    ): ( <p>{TEXT.WITHOUT} {TEXT.PERMISSIONS_ASSIGNED} FALTA ESTE ESTILO</p>)} 
                </div>
            </div>
            {(canEdit || canDetails || canDelete) && (
                <div id="generalCardBtnsColumn">
                    {canDetails && (
                        <button className="btn btn-outline-success" id="generalCardBtnDetails" onClick={() => navigage(`/roles/detail/${role._id}`, { state: { role } })}><BiSolidUserDetail className="iconBtnGeneralDetail" /></button>
                    )}
                    {canEdit && (
                        <button className="btn btn-outline-primary" id="generalCardBtnEdit" onClick={() => navigage(`/roles/form/${role._id}`, { state: { role } })}><FaUserEdit className="iconBtnGeneralEdit" /></button>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger" id="generalCardBtnDelete" onClick={() => onDelete(role._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoleCard;