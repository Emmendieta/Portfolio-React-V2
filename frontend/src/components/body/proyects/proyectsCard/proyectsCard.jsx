import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { useNavigate } from "react-router-dom";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { FaRegUser, FaUserEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Carousel from "../../generalFields/carousel/carousel";
import { formatDate } from "../../../../helpers/formatDate.helper";
import Uls from "../../generalFields/Uls/Uls";
import "./proyectsCard.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function ProyectsCard({ proyect, onDelete }) {
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
            (entries) => { entries.forEach(entry => { setVisible(entry.isIntersecting); }); }, { threshold: 0.1 }
        );
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
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
                verifyPrivileges(user, "update_proyects"),
                verifyPrivileges(user, "details_proyects"),
                verifyPrivileges(user, "delete_proyects")
            ]);
            setCanEdit(editAllowed);
            setCanDetails(detailsAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={proyect._id} className={`proyCard ${visible ? 'fade-in' : ""}`}>
            {(canEdit || canDetails || canDelete) && (
                <div className="proyCardBtnCont">
                    <section className="proyCardSectBtn">
                        {canDetails && (
                            <button type="button" className="btn btn-outline-primary" id="" onClick={() => navigate(`/proyect/details/${proyect._id}`, { state: proyect })}><FaRegUser /></button>
                        )}
                        {canEdit && (
                            <button type="button" className="btn btn-outline-success" id="" onClick={() => navigate(`/proyects/form/${proyect._id}`, { state: proyect })}><FaUserEdit /></button>
                        )}
                        {canDelete && (
                            <button type="button" className="btn btn-outline-danger" id="" onClick={() => onDelete(proyect._id)}><FaRegTrashCan /></button>
                        )}
                    </section>
                </div>
            )}
            <div className="proyCardBody">
                <section className="proyCardBodyTop">
                    <div className="proyCardCarouselCont">
                        <Carousel type="proyect" id={proyect._id} images={proyect.images?.map(img => img.url) || []} width={350} height={350} />
                    </div>
                    <div className="proyCardBodyInfo">
                        <H2Fields label={TEXT.NAME} value={proyect.name?.[language] || ""} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.COMPANY} value={proyect.company?.[language] || ""} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.DATE_START} value={formatDate(proyect.dateStart)} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        <H2Fields label={TEXT.DATE_END} value={proyect.dateEnd ? formatDate(proyect.dateEnd) : `${TEXT.CURRENT}`} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        {proyect.linkCompany && (
                            <H2Fields label={TEXT.LINK_COMPANY} value={<a href={proyect.linkCompany} target="_blank" rel="noopener noreferrer">{TEXT.CLICK_HERE}</a>} language={language}
                                className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        )}
                        {proyect.linkProyect && (
                            <H2Fields label={TEXT.LINK_PROYECT} value={<a href={proyect.linkProyect} target="_blank" rel="noopener noreferrer">{TEXT.CLICK_HERE}</a>} language={language}
                                className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                        )}
                        <H2Fields label={TEXT.DESCRIPTION} value={proyect.description?.[language] || ""} language={language}
                            className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                    </div>
                </section>
                <section className="proyCardBodyBottom">
                    <div className="proyCardBodyBottomDiv">
                        {proyect.skills?.length > 0 ? (
                            <Uls list={proyect.skills} valueH1Field={`${TEXT.LANGUAGES}:`} language={language} renderItem={(skill) => (
                                <div className="proyCardUlsDivCont">
                                    <img src={skill.images?.[0]?.url || "/img/imagen-no-disponible.png"} alt={skill._id} onError={(e) => { e.currentTarget.src = "/img/imagen-no-disponible.png" }}
                                        className="proyCardSkillImg" />
                                    <H2Fields value={skill.name?.[language] || ""} language={language}
                                        className="ligthCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="ligthCardH2Label" />
                                </div>
                            )}
                                className="proyCardUlCont" classNameUl="proyCardUl" classnameli="proyCardLSimple" clH1TextDisp="proyCardTitle" />
                        ) : (
                            <div className="genListErrContDark">
                                <H2Fields value={`${TEXT.SKILLS_NOT_FOUND}!`} language={language}
                                    className="ligthCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="ligthCardH2Label" />
                                <img src="/img/not-found.jpg" className="eduCardImgNotFound" />
                            </div>
                        )}
                    </div>
                    <div className="proyCardBodyBottomDiv">
                        {proyect.responsibilities?.length > 0 ? (
                            <Uls list={proyect.responsibilities} valueH1Field={`${TEXT.RESPONSIBILITIES}:`} language={language} renderItem={(responsibility) => (
                                <H2Fields value={responsibility.name?.[language] || ""}
                                    className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                            )}
                                className="proyCardUlCont" classNameUl="proyCardUl" classnameli="proyCardLi" clH1TextDisp="proyCardTitle" />

                        ) : (
                            <div className="genListErrContDark">
                                <H2Fields value={`${TEXT.RESPONSIBILITIES_NOT_FOUND}!`} language={language}
                                    className="ligthCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="ligthCardH2Label" />
                                <img src="/img/not-found.jpg" className="eduCardImgNotFound" />
                            </div>
                        )}
                    </div>
                    <div className="proyCardBodyBottomDiv">
                        {proyect.categories?.length > 0 ? (
                            <Uls list={proyect.categories} valueH1Field={`${TEXT.CATEGORIES}:`} language={language} renderItem={(category) => (
                                <H2Fields value={category.name?.[language] || ""}
                                    className="lightCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="lightCardH2Label" />
                            )}
                                className="proyCardUlCont" classNameUl="proyCardUl" classnameli="proyCardLi" clH1TextDisp="proyCardTitle" />
                        ) : (
                            <div className="genListErrContDark">
                                <H2Fields value={`${TEXT.NO_CATEGORIES_FOUND}!`} language={language}
                                    className="ligthCardH2FieldCont" classNameH2="lightCardH2Text" classNameLabel="ligthCardH2Label" />
                                <img src="/img/not-found.jpg" className="eduCardImgNotFound" />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProyectsCard;