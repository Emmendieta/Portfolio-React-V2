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

function Curriculum() {
    const { user } = useContext(UserContext);
    const [data, setData] = useState(null);
    const [educations, setEducations] = useState([]);
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
                console.log("CURRICULUM DATA DOCS", docs[0])
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


    //Educations:
    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const result = await fetchGetAllEducationsPopulate();
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
                const educationsRes = result.response || [];
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

    //Works:
    useEffect(() => {
        const loadWorks = async () => {
            try {
                startLoading();
                const result = await fetchGetAllWorksPopulate();
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
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
                if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || `${TEXT.ERROR}: ${TEXT.TEXT_ERROR_OOPS}`);
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

    const EDUCATIONS_ORDER = { "Course": 1, "University": 2, "High School": 3, "Primary School": 4, "Conference": 5, "Other": 6 };
    const sortedEducations = [...(data?.educations || [])].sort((a, b) => {
        return (EDUCATIONS_ORDER[a.type] || 99) - (EDUCATIONS_ORDER[b.type] || 99);
    });
    const groupedEducations = sortedEducations.reduce((acc, edu) => {
        const type = edu.typeEducation;
        if (!acc[type]) acc[type] = [];
        acc[type].push(edu);
        return acc;
    }, {});

    return (
        <div>
            <section>
                <H1Fields value={`${data.lastName} ${data.firstName}`} label={TEXT.FULL_NAME} language={language}
                    clH1Cont="" clH1Text=""/>
            </section>
        </div>
    );
};

export default Curriculum;