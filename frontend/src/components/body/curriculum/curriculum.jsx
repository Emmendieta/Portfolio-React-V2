import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/User.Context";
import { useSweetAlert } from "../../../context/SweetAlert2.Context";
import { useLanguage } from "../../../context/Language.Context";
import { LANG_CONST } from "../../../constants/SelectLang.Constant";
import { useLoading } from "../../../context/Loading.Context";
import { fetchGetAllPeoplePaginatePopulate } from "../people/peopleLogic";
import { fetchGetAllEducationsPopulate } from "../educations/educationsLogic";
import { fetchGetAllWorksPopulate } from "../works/worksLogis";
import { fetchGetAllProyectsPopulate } from "../proyects/proyectsLogic";
import H1Fields from "../generalFields/h1Fields/h1fields";
import H2Fields from "../generalFields/h2Fields/h2Fields";
import { formatDate } from "../../../helpers/formatDate.helper";
import { fetchGetAllSkills } from "../skills/skillsLogic";
import "./curriculum.css";
import { fetchGetUsers } from "../users/userLogic";

function Curriculum() {
    const { user } = useContext(UserContext);
    const [data, setData] = useState(null);
    const [educations, setEducations] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [highSchools, setHighSchools] = useState([]);
    const [primarySchools, setPrimarySchools] = useState([]);
    const [courses, setCourses] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [others, setOthers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [hardSkills, setHardSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [proyects, setProyects] = useState([]);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const [searchDNI, setSearchDNI] = useState("");
    const [searchDNIFilter, setSearchDNIFilter] = useState("");
    const [searchFullName, setSearchFullName] = useState("");
    const [searchFullNameFilter, setSearchFullNameFilter] = useState("")
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const typeEducationLabels = {
        "Primary School": { en: "Primary School", es: "Escuela primaria" },
        "High School": { en: "High School", es: "Secundario" },
        "University": { en: "University", es: "Universidad" },
        "Course": { en: "Course", es: "Curso" },
        "Conference": { en: "Conference", es: "Conferencia" },
        "Other": { en: "Other", es: "Otro" }
    };

    //Person
    useEffect(() => {
        const loadData = async () => {
            try {
                startLoading();
                const params = { page, limit: 10, language, searchPerson: searchFullNameFilter, searchDNI: searchDNIFilter, searchContinent: "", searchCountry: "", searchProvince: "", searchCity: "" };
                const result = await fetchGetAllPeoplePaginatePopulate(params);
                if (result?.error) {
                    setData([]);
                    setTotalPages(1);
                    console.error(`${TEXT.ERROR}: ${result?.error?.message}`);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}`);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setData(docs[0]);
                setTotalPages(totalPages);
            } catch (error) {
                setData([]);
                setTotalPages(1);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadData();
    }, [user, language]);

    //User:
    useEffect(() => {
        const loadUsers = async () => {
            try {
                startLoading();
                const result = await fetchGetUsers()
                if(result?.error) return errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const userResponse = result.response[0] || [];
                setDataUser(userResponse);
            } catch (error) {
                setDataUser([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadUsers();
    }, [user, language]);

    //Educations:
    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const result = await fetchGetAllEducationsPopulate();
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const educationsRes = result.response || [];
                const universities = educationsRes.filter(education => education.typeEducation === "University") || [];
                const sortedUniversities = [...universities].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setUniversities(sortedUniversities);
                const highSchools = educationsRes.filter(education => education.typeEducation === "High School") || [];
                const sortedHighSchools = [...highSchools].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setHighSchools(sortedHighSchools);
                const primarySchools = educationsRes.filter(education => education.typeEducation === "Primary School") || [];
                const sortedPrimarySchools = [...primarySchools].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setPrimarySchools(sortedPrimarySchools);
                const courses = educationsRes.filter(education => education.typeEducation === "Course") || [];
                const sortedCourse = [...courses].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setCourses(sortedCourse);
                const conferences = educationsRes.filter(education => education.typeEducation === "Conference") || [];
                const sortedConferences = [...conferences].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setConferences(sortedConferences);
                const others = educationsRes.filter(education => education.typeEducation === "Other") || [];
                const sortedOthers = [...others].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setOthers(sortedOthers);
                setEducations(educationsRes);
            } catch (error) {
                setEducations([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, [user, language]);

    //SKills;
    useEffect(() => {
        const loadSkills = async () => {
            try {
                startLoading();
                const result = await fetchGetAllSkills();
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const skillsResp = result.response || [];
                const hard = skillsResp.filter(skill => skill.type === "Hard") || [];
                const sortedHard = [...hard].sort((a, b) => Number(a.order || 0) - Number(b.roder || 0));
                const soft = skillsResp.filter(skill => skill.type === "Soft") || [];
                const sortedSoft = [...soft].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setSkills(skillsResp);
                setHardSkills(sortedHard);
                setSoftSkills(sortedSoft);
            } catch (error) {
                setSkills([]);
                setHardSkills([]);
                setSoftSkills([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadSkills();
    }, [user, language]);

    //Works:
    useEffect(() => {
        const loadWorks = async () => {
            try {
                startLoading();
                const result = await fetchGetAllWorksPopulate();
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const worksRes = result.response || [];
                setWorks(worksRes);
            } catch (error) {
                setWorks([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWorks();
    }, [user, language]);

    //Proyects
    useEffect(() => {
        const loadProyects = async () => {
            try {
                startLoading();
                const result = await fetchGetAllProyectsPopulate();
                if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const proyectRes = result.response || [];
                setProyects(proyectRes);
            } catch (error) {
                setProyects([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProyects();
    }, [user, language]);

    console.log("USER", dataUser)

    return (
        <div className="currCont">
            <section className="currSectTopCont">
                <div className="currTopPersonalCont">
                    <H1Fields value={`${data?.lastName ?? ""} ${data?.firstName || ""}`} language={language}
                        clH1Cont="currH1NameCont" clH1Text="currH1Name" />
                    <H2Fields value={data?.jobTitle?.[language] || ""} language={language}
                        className="currH2JobCont" classNameH2="currH2Job" />
                </div>
                <div className="currTopImgCont">
                    <img src={data?.images?.[0]?.url || "/img/imagen-no-disponible.png"} alt={data?._id ?? "ID"} onError={(e) => { e.currentTarget.src = "/img/imagen-no-disponible.png" }}
                        className="currImg" />
                </div>
                <div className="currTopDetailsCont">
                    <H2Fields value={`${data?.address?.street} ${data?.address?.number} - ${data?.cities[0]?.name?.[language]} - ${data?.provinces[0]?.name?.[language]} - ${data?.countries[0]?.name?.[language]}`} label={TEXT.PERSONAL_ADDRESS} language={language}
                        className="currTopH2Cont" classNameH2="currTopH2" classNameLabel="currTopH2Label" />
                    <H2Fields value={`${data?.legalAddress?.street} ${data?.legalAddress?.number} - ${data?.cities[0]?.name?.[language]} - ${data?.provinces[0]?.name?.[language]} - ${data?.countries[0]?.name?.[language]}`} label={TEXT.LEGAL_ADDRESS} language={language}
                        className="currTopH2Cont" classNameH2="currTopH2" classNameLabel="currTopH2Label" />
                    <H2Fields value={formatDate(data?.birthday)} label={TEXT.BIRTHDAY} language={language}
                        className="currTopH2Cont" classNameH2="currTopH2" classNameLabel="currTopH2Label" />
                    <H2Fields value={dataUser?.email} label={TEXT.EMAIL} language={language}
                        className="currTopH2Cont" classNameH2="currTopH2" classNameLabel="currTopH2Label" />
                </div>
            </section>
            <section className="currSectMiddleCont">
                <div className="currMidDivCont">
                    <H1Fields value={`${TEXT.PROFESSIONAL_EXP}:`} language={language}
                        clH1Cont="currMidH1Cont" clH1Text="currMidH1" />
                    {works.length > 0 ? (
                        <div className="currFieldCont">
                            {works.map((work) => (
                                <div key={work._id} className="currFieldDetailCont">
                                    <H2Fields value={work.jobTitle?.[language] || ""} language={language}
                                        className="currFieldH2TitleCont" classNameH2="currFieldH2Title" />
                                    <H2Fields value={work.company?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(work.dateStart)} - ${work.dateEnd ? formatDate(work.dateEnd): TEXT.CURRENT}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                </div>
                <div className="currMidDivCont">
                    <H1Fields value={`${TEXT.ACADEMIC_BACKGROUND}:`} language={language}
                        clH1Cont="currMidH1Cont" clH1Text="currMidH1" />
                    {courses.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.COURSES}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {courses.map((course) => (
                                <div key={course._id} className="currFieldDetailCont">
                                    <H2Fields value={course.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={course.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(course.dateStart)} - ${course.dateEnd ? formatDate(course.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                    {universities.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.UNIVERSITIES}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {universities.map((uni) => (
                                <div key={uni._id} className="currFieldDetailCont">
                                    <H2Fields value={uni.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={uni.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(uni.dateStart)} - ${uni.dateEnd ? formatDate(uni.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<> </>)}
                    {highSchools.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.HIGH_SCHOOLS}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {highSchools.map((high) => (
                                <div key={high._id} className="currFieldDetailCont">
                                    <H2Fields value={high.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={high.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(high.dateStart)} - ${high.dateEnd ? formatDate(high.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                    {primarySchools.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.PRIMARY_SCHOOLS}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {primarySchools.map((primary) => (
                                <div key={primary._id} className="currFieldDetailCont">
                                    <H2Fields value={primary.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={primary.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(primary.dateStart)} - ${primary.dateEnd ? formatDate(primary.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                    {conferences.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.CONFERENCES}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {conferences.map((conf) => (
                                <div key={conf._id} className="currFieldDetailCont">
                                    <H2Fields value={conf.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={conf.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(conf.dateStart)} - ${conf.dateEnd ? formatDate(conf.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                    {others.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.OTHERS}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {others.map((other) => (
                                <div key={other._id} className="currFieldDetailCont">
                                    <H2Fields value={other.institutionName?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={other.title?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(other.dateStart)} - ${other.dateEnd ? formatDate(other.dateEnd) : TEXT.ONGOING}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                </div>
                <div className="currMidDivCont">
                    <H1Fields value={`${TEXT.SKILLS}:`} language={language}
                        clH1Cont="currMidH1Cont" clH1Text="currMidH1" />
                    {hardSkills.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.HARD_SKILLS}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {hardSkills.map((hard) => (
                                <div key={hard._id} className="currFieldDetailContRow">
                                    <H2Fields value={`${hard.name?.[language] || ""}:`} language={language}
                                        className="currFieldH2ContRow" classNameH2="currFieldH2BoldRow" />
                                    <H2Fields value={`${hard.percent}%`} language={language}
                                        className="currFieldH2ContRow" classNameH2="currFieldH2"/>
                                </div>
                            ))}
                        </div>
                    ): (<></>)}
                    {softSkills.length > 0 ? (
                        <div className="currFieldCont">
                            <H2Fields value={`${TEXT.SOFT_SKILLS}:`} language={language}
                                className="currFieldH2SubtitleCont" classNameH2="currFieldH2Subtitle" />
                            {softSkills.map((soft)=> (
                                <div key={soft._id} className="currFieldDetailContRow">
                                    <H2Fields value={`${soft.name?.[language] || ""}`} language={language}
                                        className="currFieldH2ContRow" classNameH2="currFieldH2Bold" />
                                </div>
                            ))}
                        </div>
                    ): (<></>)}
                </div>
                <div className="currMidDivCont">
                    {proyects.length > 0 ? (
                        <div className="currMidDivCont">
                            <H1Fields value={`${TEXT.PROYECTS}:`} language={language}
                                clH1Cont="currMidH1Cont" clH1Text="currMidH1" />
                            {proyects.map((proy) => (
                                <div key={proy._id} className="currFieldDetailCont">
                                    <div className="currFieldCont">
                                        <H2Fields value={proy.name?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Bold" />
                                    <H2Fields value={proy.company?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={`${formatDate(proy.dateStart)} - ${proy.dateEnd ? formatDate(proy.dateEnd) : TEXT.CURRENT}`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2" />
                                    <H2Fields value={proy.description?.[language] || ""} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Desc" />
                                    </div>
                                    <div className="currFieldSubCont">
                                        <H2Fields value={`${TEXT.CATEGORIES}:`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Subtitle" />
                                        {proy.categories.length > 0 ? (
                                            <div className="currFieldContRow">
                                                {proy.categories.map((category) => (
                                                    <div key={category._id} className="currFieldDetailContRow">
                                                        <H2Fields value={category.name?.[language]} language={language}
                                                        className="currFieldH2Cont" classNameH2="currFieldH2Subtitle" />
                                                    </div>
                                                ))}
                                            </div>
                                        ): (<></>)}
                                    </div>
                                    <div className="currFieldSubCont">
                                        <H2Fields value={`${TEXT.SKILLS}:`} language={language}
                                        className="currFieldH2Cont" classNameH2="currFieldH2Subtitle" />
                                        {proy.skills.length > 0 ? (
                                            <div className="currFieldContRow">
                                                {proy.skills.map((skill) => (
                                                    <div key={skill._id} className="currFieldDetailContRow">
                                                        <H2Fields value={skill.name?.[language] || ""} language={language}
                                                            className="currFieldH2Cont" classNameH2="currFieldH2Subtitle" />
                                                    </div>
                                                ))}
                                            </div>
                                        ): (<></>)}
                                    </div>
                                    <div>
                                        //PODRIA PONER UN QR POR CADA PROYECT
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<></>)}
                </div>
            </section>
            <section>
                //QR
            </section>
        </div>
    );
};

export default Curriculum;