import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useLoading } from "../../../../context/Loading.Context";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { Link, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { useRef } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { BiSolidUserDetail } from "react-icons/bi";
import { fetchPerson } from "../peopleLogic";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";


function PeopleCard({ person, onDelete }) {
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
                verifyPrivileges(user, "update_people"),
                verifyPrivileges(user, "details_people"),
                verifyPrivileges(user, "delete_people")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={person._id} className={`generalCardRow ${visible ? 'fade-in' : ""}`}>
            <div id="generalCardBodyRow">
                <H2Fields label={TEXT.ID} value={person._id} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
                <H2Fields label={TEXT.DNI} value={person.dni}className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
                <H2Fields label={TEXT.FULL_NAME} value={person.lastName + " " + person.firstName} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
            </div>
            {(canEdit || canDetails || canDelete) && (
                <div id="generalCardBtnsRow">
                    {canDetails && (
                        <button className="btn btn-outline-success" id="generalCardBtnDetails" onClick={() => navigate(`/people/detail/${person._id}`, { state: { person } })}><BiSolidUserDetail className="iconBtnGeneralDetailPerson" /></button>
                    )}
                    {canEdit && (
                        <button className="btn btn-outline-primary" id="generalCardBtnEdit" onClick={() => navigate(`/people/form/${person._id}`, { state: { person } })}><FaUserEdit className="iconBtnGeneralEdit" /></button>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger" id="generalCardBtnDelete" onClick={() => onDelete(person._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PeopleCard;