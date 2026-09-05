import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import Uls from "../../generalFields/Uls/Uls";
import EducationsCard from "../educationsCard/educationsCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { fetchDeleteEducationById, fetchGetAllEducationsPopulate } from "../educationsLogic";
import CarouselGeneric from "../../generalFields/carouselGeneric/carouselGeneric";
import "./educationsList.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function EduactionsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [highSchools, setHighSchools] = useState([]);
    const [primarySchools, setPrimarySchools] = useState([]);
    const [courses, setCourses] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [others, setOthers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, confirmSweet, successSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    //VerifyPrivileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_educations");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const result = await fetchGetAllEducationsPopulate();
                if (result?.error) {
                    await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const educations = result.response || [];
                setUniversities(educations.filter(education => education.typeEducation === "University") || []);
                setHighSchools(educations.filter(education => education.typeEducation === "High School") || []);
                setPrimarySchools(educations.filter(education => education.typeEducation === "Primary School") || []);
                setCourses(educations.filter(education => education.typeEducation === "Course") || []);
                setConferences(educations.filter(education => education.typeEducation === "Conference") || []);
                setOthers(educations.filter(education => education.typeEducation === "Other") || []);
                setEducations(educations);
            } catch (error) {
                setEducations([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, [language]);


    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_EDUCATION,
                confirmButtomText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteEducationById(id);
            if (result?.error) return await errorSweet(`${TEXT.COULDNT_DELETE} ${TEXT.THE_F} ${TEXT.EDUCATION}. ${TEXT.ERROR}: ${result?.error?.message}`);
            await successSweet(`${TEXT.COULDNT_DELETE} ${TEXT.THE_F} ${TEXT.EDUCATION}`);
            setEducations(prev => prev.filter(education => education._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}`);
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    // SIN EL CAROUSEL:

    /*return (
        <div className="eduListDivCont">
            <section className="eduListSectAddCont">
                <Link to={"/educations/form/new"}>
                    <button type="button" className="btn btn-outline-success" id="btnAddEdu">{`${TEXT.NEW_F} ${TEXT.EDUCATION}`}</button>
                </Link>
            </section>
            VER SI PONGO BUSCADORES (HAY QUE EDITAR EL METODO DEL FETCH)
            <section>
                <div>
                    {educations.length > 0 ? (
                        <Uls list={educations} classNameUl="" classnameli="" valueH1Field={`${TEXT.EDUCATIONS_LIST}`} language={language} renderItem={(education) => (
                            <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                        )} />
                    ): (
                        <div className="genListErrCont">
                            <H2Fields value={`${TEXT.EDUCATIONS_NOT_FOUND}!`} className="genListErr" classNameH2="genListErrH2" language={language} />
                            <img src="/img/not-found.jpg"/>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );*/

    // CON EL CAROUSEL:
    return (
        <div className="eduListDivCont">
            {canCreate && (
                <section className="eduListSectAddCont">
                    <Link to={"/educations/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddEdu">{`${TEXT.NEW_F} ${TEXT.EDUCATION}`}</button>
                    </Link>
                </section>
            )}
            <section>
                {educations.length > 0 ? (
                    <div>
                        {courses.length > 0 ? (
                            <div>
                                <H2Fields value={`${TEXT.CORSES}:`} language={language}
                                    className="lightTitleH2FieldCont" classNameH2="lightTitleH2Text" />
                                <CarouselGeneric items={courses} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<> </>)}
                        {universities.length > 0 ? (
                            <div>
                                <div className="eduDivLineTop"></div>
                                <H2Fields value={`${TEXT.UNIVERSITIES}:`} language={language}
                                    className="lightTitleH2FieldCont" classNameH2="lightTitleH2Text" />
                                <CarouselGeneric items={universities} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                        {highSchools.length > 0 ? (
                            <div>
                                <div className="eduDivLineTop"></div>
                                <H2Fields value={`${TEXT.HIGH_SCHOOLS}:`} language={language}
                                    className="lightTitleH2FieldCont" classNameH2="lightTitleH2Text" />
                                <CarouselGeneric items={highSchools} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                        {primarySchools.length > 0 ? (
                            <div>
                                <div className="eduDivLineTop"></div>
                                <H2Fields value={`${TEXT.PRIMARY_SCHOOLS}:`} language={language}
                                    className="lightTitleH2FieldCont" classNameH2="lightTitleH2Text" />
                                <CarouselGeneric items={primarySchools} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                        {conferences.length > 0 ? (
                            <div>
                                <div className="eduDivLineTop"></div>
                                <H2Fields value={`${TEXT.CONFERENCES}:`} language={language}
                                    className="lightTitleH2FieldCont" classNameH2="lightTitleH2Text" />
                                <CarouselGeneric items={conferences} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                        {others.length > 0 ? (
                            <div>
                                <div className="eduDivLineTop"></div>
                                <H2Fields value={`${TEXT.OTHERS}:`} language={language}
                                    className="" classNameH2="" />
                                <CarouselGeneric items={others} renderItem={(education) => (
                                    <EducationsCard key={education._id} education={education} onDelete={handleDelete} />
                                )} />
                            </div>
                        ) : (<></>)}
                    </div>
                ) : (
                    <div className="genListErrCont">
                        <H2Fields value={`${TEXT.EDUCATIONS_NOT_FOUND}!`} className="genListErr" classNameH2="genListErrH2" language={language} />
                        <img src="/img/not-found.png" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default EduactionsList;