import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Carousel from "../../generalFields/carousel/carousel";
import "./skillsCard.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SkillsCard({ skill, onDelete, onClick }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const ref = useRef(null);
    const animationRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    const typesLeves = {
        "Beginner": { en: "Beginner", es: "Principiante" },
        "Medium": { en: "Medium", es: "Intermedio" },
        "Advance": { en: "Advance", es: "Avanzado" },
        "Expert": { en: "Expert", es: "Experto" }
    };

    const getLevel = () => {
        const percent = skill.percent;
        if (percent > 0 && percent <= 25) return typesLeves.Beginner[language];
        if (percent > 25 && percent <= 50) return typesLeves.Medium[language];
        if (percent > 50 && percent <= 75) return typesLeves.Advance[language];
        if (percent > 75 && percent <= 100) return typesLeves.Expert[language];
    }

    useEffect(() => {
        const obersver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    animateProgress(skill.percent || 0);
                } else {
                    setVisible(false);
                    resetProgress();
                }
            });
        }, { threshold: 0.3 }
        );
        if (ref.current) obersver.observe(ref.current);
        return () => {
            obersver.disconnect();
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [skill.percent]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) { 
                setCanEdit(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_skills"),
                verifyPrivileges(user, "delete_skills")
            ]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const animateProgress = (target) => {
        if (animationRef.current) clearInterval(animationRef.current);
        let start = 0;
        const duration = 450;
        const stepTime = 5;
        const increment = target / (duration / stepTime);
        animationRef.current = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(animationRef.current);
            };
            setProgress(Math.round(start));
        }, stepTime);
    };

    const resetProgress = () => {
        if (animationRef.current) clearInterval(animationRef.current);
        setProgress(0);
    };

    const isSoft = skill.type == "Soft";

    return (
        <div key={skill._id} ref={ref} className="skillCard">
            {!isSoft && (
                <>
                    <section className="skillCardCircProgressCont">
                        <div className="skillsCardCircProgressDiv">
                            <CircularProgressbarWithChildren value={progress} styles={buildStyles({ pathColor: "#3c9b75ff", trailColor: "#27496bff", strokeLinecap: "round", })}>
                                <div className="skillsCardCarouselCont">
                                    <Carousel type="skill" id={skill._id} images={skill.images?.map(img => img.url) || []} width={100} height={100} showNextPrev={false} 
                                        clCont="skillCardCarouselCont" clImgCont="skillCardCarouselImgCont" clDivImgCont="skillCardCarouselImgCont" clImg="skillCardCarouselImg"/>
                                </div>
                            </CircularProgressbarWithChildren>
                        </div>
                    </section>
                    <section className="skillCardBody">
                        <H2Fields value={skill.name?.[language] || ""} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2TextNoLabel" />
                        <H2Fields value={skill.percent ? `${skill.percent}%` : "0%"} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2TextNoLabel" />
                    </section>
                    {(canEdit || canDelete) && (
                        <section className="skillCardBtnCont">
                            {canEdit && (
                                <Link to={`/skills/form/${skill._id}`} id="skillCardEdit" className="btn btn-outline-primary btn-sm"><FaPen /></Link>
                            )}
                            {canDelete && (
                                <button className="btn btn-outline-danger btn-sm" id="skillCardDelete" onClick={() => onDelete(skill._id)} ><FaRegTrashCan /> </button>
                            )}
                        </section>
                    )}
                </>
            )}
            {isSoft && (
                <>
                    <section className="skillCardBody">
                        <H2Fields value={skill.name?.[language] || ""} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2TextNoLabel" />
                    </section>
                    <section className="skillCardBarCont">
                        <SoftSkillBar percent={progress} />
                        <H2Fields value={getLevel(skill.percent) || 0} language={language}
                            className="darkCardH2FieldCont" classNameH2="darkCCardH2TextNoLabel" />
                    </section>
                    {(canEdit || canDelete) && (
                        <section className="skillCardSoftBtnCont">
                            {canEdit && (
                                <Link to={`/skills/form/${skill._id}`} id="skillCardEdit" className="btn btn-outline-primary btn-sm"><FaPen /></Link>
                            )}
                            {canDelete && (
                                <button className="btn btn-outline-danger btn-sm" id="skillCardDelete" onClick={() => onDelete(skill._id)} ><FaRegTrashCan /> </button>
                            )}
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

/* ---------------- Soft Skill Bar ---------------- */

function SoftSkillBar({ percent }) {
    const segments = 4;
    return(
        <div className="softSkillBar">
            {Array.from({ length: segments }).map((_, index) => {
                const segmentStart = index * 25;
                const segmentProgress = Math.min(Math.max(percent - segmentStart, 0), 25);
                const fillPercent = (segmentProgress / 25) * 100;
                return (
                    <div className="barSegment" key={index}>
                        <div className="barSegmentFill" style={{ width: `${fillPercent}%`}} />
                    </div>
                );
            })};
        </div>
    );
};

export default SkillsCard;

