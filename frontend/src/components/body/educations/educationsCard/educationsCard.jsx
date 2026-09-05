import Carousel from "../../generalFields/carousel/carousel";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { Link, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiSolidUserDetail } from "react-icons/bi";
import { formatDate } from "../../../../helpers/formatDate.helper";
import "./educationsCard.css";
import Uls from "../../generalFields/Uls/Uls";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function EducationsCard({ education, onDelete }) {
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
    const educationsTransaltions = {
        "Primary School": {
            es: "Escuela Primaria",
            en: "Primary School"
        },
        "High School": {
            es: "Escuela Secundaria",
            en: "High School"
        },
        "University": {
            es: "Universidad",
            en: "University"
        },
        "Course": {
            es: "Curso",
            en: "Course"
        },
        "Conference": {
            es: "Conferencia",
            en: "Conference"
        },
        "Other": {
            es: "Otro",
            en: "Other"
        }
    };
    const educationTypeValue = educationsTransaltions[education.typeEducation]?.[language] || "";

    //VerifyPrivileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) { 
                setCanEdit(false);
                setCanDetails(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, detailsAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_educations"),
                verifyPrivileges(user, "details_educations"),
                verifyPrivileges(user, "delete_educations")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }) },
            { threshold: 0.1 }
        );
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <div key={education._id} className={`educationCard ${visible ? 'fade-in' : ""}`}>
            {(canEdit || canDetails || canDelete) && (
            <div className="eduCardBtnCont">
                <section className="eduCardSectBtn">
                    {canDetails && (
                        <button className="btn btn-outline-success btn-sm" id="eduCardDetail" onClick={() => navigate(`/educations/details/${education._id}`, { state: { education } })}><BiSolidUserDetail className="iconEduDetail" /></button>
                    )}
                    {canEdit && (
                        <Link to={`educations/form/${education._id}`} id="eduCardEdit" className="btn btn-outline-primary btn-sm">
                            <FaPen />
                        </Link>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger btn-sm" id="eduCardDelete" onClick={() => onDelete(education._id)}>
                            <FaRegTrashCan />
                        </button>
                    )} 
                </section>
            </div>
            )}
            <div className="eduCardBody">
                <section className="eduCardBodyTop">
                    <div className="eduCardCarouselCont">
                        <Carousel type="education" id={education._id} images={education.images?.map(img => img.url) || []} width={350} height={350}
                        /* clCont="" clImgCont="" clDivImgCont="" clBtnPrev="" clBtnNext="" */ />
                    </div>
                    <div className="eduCardBodyInfo">
                        <H2Fields label={TEXT.INSTITUTION} value={`${education.institutionName?.[language] || ""}`} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.TITLE} value={`${education.title?.[language] || ""}`} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.DATE_START} value={formatDate(education.dateStart)} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.DATE_END} value={education.dateEnd ? formatDate(education.dateEnd) : TEXT.ONGOING} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        {education.linkInstitution && (
                            <H2Fields label={TEXT.LINK_INSTITUTION} value={<a href={education.linkInstitution} target="_blank" rel="noopener noreferrer">{TEXT.CLICK_HERE}</a>} language={language}
                                className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        )}
                        {education.linkCertificate && (
                            <H2Fields label={TEXT.LINK_CERTIFICATE} value={<a href={education.linkCertificate} target="_blank" rel="noopener noreferrer">{TEXT.CLICK_HERE}</a>} language={language}
                                className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        )}
                        <H2Fields label={TEXT.DESCRIPTION} value={`${education.description?.[language] || ""}`} language={language} onChange={() => { }}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    </div>
                </section>
                <section className="eduCardBodyBotom">
                    {education?.habilities?.length > 0 ? (
                        <Uls list={education.habilities} valueH1Field={`${TEXT.HABILITIES}:`} language={language} renderItem={(hability) => (
                            <H2Fields value={hability.name?.[language] || ""}
                                className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        )}
                            className="eduCardUlCont" classNameUl="eduCardUl" classnameli="eduCardLi" clH1TextDisp="eduCardTitle" />
                    ) : (
                        <div className="genListErrContDark">
                            <H2Fields value={`${TEXT.RESPONSIBILITIES_NOT_FOUND}!`} language={language}
                                className="darkCardH2FieldCont" classNameH2="darkCCardH2Text" classNameLabel="darkCardH2Label" />
                            <img src="/img/not-found.png" className="eduCardImgNotFound" />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EducationsCard;