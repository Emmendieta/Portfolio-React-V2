import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { Link, useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Carousel from "../../generalFields/carousel/carousel";
import { formatDate } from "../../../../helpers/formatDate.helper";
import Uls from "../../generalFields/Uls/Uls";
import "./worksCard.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function WorksCard({ work, onDelete }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();
    const TEXT = LANG_CONST[language];
    const [canEdit, setCanEdit] = useState(false);
    const [canDetails, setCanDetails] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1 });
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    useEffect(() => {
        setImages[work.images];
    }, []);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanEdit(false);
                setCanDetails(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, detailsAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_works"),
                verifyPrivileges(user, "details_works"),
                verifyPrivileges(user, "delete_works")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={work._id} className={`workCard ${visible ? 'fade-in' : ""}`}>
            {(canEdit || canDetails || canDelete) && (
                <div className="workCardBtnCont">
                    <section className="workCardSectBtn">
                        {canDetails && (
                            <button className="btn btn-outline-success btn-sm" id="workCardDetail" onClick={() => navigate(`/works/details/${work._id}`, { state: { work } })}><BiSolidUserDetail /></button>
                        )}
                        {canEdit && (
                            <Link to={`/works/form/${work._id}`} id="workCardEdit" className="btn btn-outline-primary btn-sm">
                                <FaPen />
                            </Link>
                        )}
                        {canDelete && (
                            <button className="btn btn-outline-danger btn-sm" id="workCardDelete" onClick={() => onDelete(work._id)}>
                                <FaRegTrashCan />
                            </button>
                        )}
                    </section>
                </div>
            )}
            <div className="workCardBody">
                <section className="workCardBodyTop">
                    <div className="workCarouselCont">
                        <Carousel type="work" id={work._id} images={work.images?.map(img => img.url) || []} width={350} height={350} />
                    </div>
                    <div className="workBodyInfo">
                        <H2Fields label={TEXT.JOB_TITLE} value={work.jobTitle?.[language] || ""} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                        <H2Fields label={TEXT.COMPANY} value={work.company?.[language] || ""} className="darkCardH2FieldCont"
                            classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" language={language} />
                        <H2Fields label={TEXT.DATE_START} value={formatDate(work.dateStart)} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                        <H2Fields label={TEXT.DATE_END} value={work.dateEnd ? formatDate(work.dateEnd) : TEXT.CURRENT} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                        {work.linkCompany && (
                            <H2Fields label={TEXT.LINK_COMPANY} value={<a href={work.linkCompany} target="_blank" rel="noopener noreferrer">{TEXT.CLICK_HERE}</a>}
                                className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" language={language} />
                        )}
                        <H2Fields label={TEXT.DESCRIPTION} value={work.description?.[language] || ""} language={language}
                            className="darkCardH2FieldContColumn" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                    </div>
                </section>
                <section className="workCardBodyBottom">
                    {work?.responsibilities?.length > 0 ? (
                        <Uls list={work.responsibilities} valueH1Field={`${TEXT.RESPONSIBILITIES}:`} language={language} renderItem={(responsibility) => (
                            <H2Fields value={responsibility.name?.[language] || ""}
                                className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                        )}
                            className="workCardUlCont" classNameUl="workCardUl" classnameli="workCardLi" clH1TextDisp="workCardTitle" />
                    ) : (
                        <div className="genListErrContDark">
                            <H2Fields value={`${TEXT.RESPONSIBILITIES_NOT_FOUND}!`} language={language}
                                className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                            <img src="/img/not-found.jpg" className="workCardImgNotFound" />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default WorksCard;