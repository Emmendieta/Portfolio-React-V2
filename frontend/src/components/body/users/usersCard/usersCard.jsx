import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import Carousel from "../../generalFields/carousel/carousel";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BiSolidUserDetail } from "react-icons/bi";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function UserCard({ user, onDelete }) {
    const { user: currentUser } = useContext(UserContext);
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
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1, } );
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
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
                verifyPrivileges(user, "update_users"),
                verifyPrivileges(user, "details_users"),
                verifyPrivileges(user, "delete_users")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={user._id} className={`generalCardRow ${visible ? 'fade-in' : ""}`}>
            <div className="generalCardContainerRow">
                <div id="generalCardContainerCarousel">
                    <Carousel type="user" id={user._id} images={user.people?.thumbnails} width={300} height={300} clCont="generalCarouselCont" clImgCont="generalCarouselImgCont" clDivImgCon="generalCarouselDivImgCon"
                            clImg="generalCarouselImg" clBtnPrev="generalCarouselBtnPrev" clBtnNext="generalCarouselBtnNext" />
                </div>
                <div>
                    <div id="generalCardBodyColumn">
                        <H2Fields label={TEXT.ID} value={user._id} className="" classNameLabel="" classNameH2="" language={language} />
                        <H2Fields label={TEXT.FULL_NAME} value={user.people?.lastName + " " + user.people?.firstName} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
                        <H2Fields label={TEXT.DNI} value={user.people?.dni} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />
                        <H2Fields label={TEXT.USER_NAME} value={user.user} className={"cardH2FieldsRow"} classNameLabel={"cardH2FieldsRowLabel"} classNameH2={"cardH2FieldsRowH2"} language={language} />            
                    </div>
                </div>
                {(canEdit || canDetails || canDelete) && (
                    <div id="generalCardBtnsInColumn">
                        {canDetails && (
                            <button className="btn btn-outline-success" id="generalCardBtnDetailsCol" onClick={() => navigate(`/users/detail/${user._id}`, { state: { user } })}><BiSolidUserDetail className="iconBtnGeneralDetail" /></button>
                        )}
                        {canEdit && (
                            <button className="btn btn-outline-primary" id="generalCardBtnEditcol" onClick={() => navigate(`/users/form/${user._id}`, { state: { user } })}><FaUserEdit className="iconBtnGeneralEdit" /></button>
                        )}
                        {canDelete && (
                            <button className="btn btn-outline-danger" id="generalCardBtnDeletecol" onClick={() => onDelete(user._id)}><FaRegTrashCan className="iconBtnGeneralDelete" /></button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;