import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeleteSkillById, fetchGetAllSkills } from "../skillsLogic";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import SkillsCard from "../skillsCard/skillsCard";
import Uls from "../../generalFields/Uls/Uls";
import "./skillsList.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function SkillsList() {
    const { user } = useContext(UserContext);
    const [skills, setSkills] = useState("");
    const [softSkills, setSoftSkills] = useState([]);
    const [hardSkills, setHardSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, confirmSweet, successSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadSkills = async () => {
            try {
                //FALTA VALIDAR USUSARIO
                startLoading();
                const result = await fetchGetAllSkills();
                if (result?.error) {
                    setSkills([]);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message} || ${TEXT.TEXT_ERROR_OOPS}`);
                    return;
                };
                const skills = result.response || [];
                const softSkills = skills.filter(skill => skill.type === "Soft");
                const sortedSoftSkills = [...softSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                const hardSkills = skills.filter(skill => skill.type === "Hard");
                const sortedHardSkills = [...hardSkills].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setSoftSkills(sortedSoftSkills);
                setHardSkills(sortedHardSkills);
                setSkills(skills);
            } catch (error) {
                setSkills([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadSkills();
    }, [language, user]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_skills");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_SKILL,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteSkillById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${TEXT.SKILL}. ${TEXT.ERROR}: ${result?.error?.message}`);
            await successSweet(`${TEXT.SKILL} ${TEXT.DELETED}!`);
            setSkills(prev => prev.filter(skill => skill._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };
    
    return (
        <div className="skillListDivCont">
            {canCreate && (
                <section className="skillListSectAddCont">
                    <Link to={"/skills/form/new"} >
                        <button type="button" className="btn btn-outline-success" id="btnAddSkill" >{`${TEXT.NEW_F} ${TEXT.SKILL}`}</button>
                    </Link>
                </section>
            )}
            <section className="skillListSectCont">
                {skills.length > 0 ? (
                    <div className="skillHardSoftListDivCont">
                        {hardSkills.length > 0 ? (
                            <div className="skillHardListCont">
                                <H2Fields value={`${TEXT.HARD_SKILLS}:`} language={language}
                                    className="darkCardH2FieldCont" classNameH2="darkCCardH2TextTitle" />
                                <Uls list={hardSkills} language={language} className="skillListUlsCont" classNameUl="skillsListUls" renderItem={(skill) => (
                                    <SkillsCard key={skill._id} skill={skill} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                        {softSkills.length > 0 ? (
                            <div className="skillSoftListCont">
                                <div className="skillDivLineTop"></div>
                                <H2Fields value={`${TEXT.SOFT_SKILLS}:`} language={language}
                                    className="darkCardH2FieldCont" classNameH2="darkCCardH2TextTitle" />
                                <Uls list={softSkills} language={language} className="skillListUlsCont" classNameUl="skillsListUls" renderItem={(skill) => (
                                    <SkillsCard key={skill._id} skill={skill} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                    </div>
                ) : (
                    <div className="genListErrContDark">
                        <H2Fields value={`${TEXT.SKILLS_NOT_FOUND}!`} className="genListErrDark" classNameH2="genListErrH2Dark" language={language} />
                        <img src="/img/not-found.png" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default SkillsList;