import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import WorksCard from "../worksCard/worksCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { fetchDeleteWorkById, fetchGetAllWorksPaginatePopulate } from "../worksLogis";
import CarouselGeneric from "../../generalFields/carouselGeneric/carouselGeneric";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import "./worksList.css";

function WorksList() {
    const { user } = useContext(UserContext);
    const [works, setWorks] = useState([]);
    const [searchByJobTitle, setSearchByJobTitle] = useState("");
    const [searchByCompany, setSearchByCompany] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, confirmSweet, successSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadWorks = async () => {
            try {
                startLoading();
                const params = { page, limit: 100, language, searchByJobTitle: "", searchByCompany: "" };
                const result = await fetchGetAllWorksPaginatePopulate(params);
                if (result?.error) {
                    setWorks([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                const sortedWworks = [...docs].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setWorks(sortedWworks);
                setTotalPages(totalPages);
            } catch (error) {
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWorks();
    }, [page, language, searchByJobTitle, searchByCompany]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_works");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_WORK,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteWorkById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.WORK} ${TEXT.DELETED}!`);
            setWorks(prev => prev.filter(work => work._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="workListDivCont">
            <section className="workListTitleCont">
                <H1Fields value={`${TEXT.WORKS}:`} language={language} clH1Cont="workListH1Cont" clH1Text="workListH1Text"/>
            </section>
            {canCreate && (
                <section className="workListSectAddCont">
                    <Link to={"/works/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddWork">{`${TEXT.NEW_M} ${TEXT.WORK}`}</button>
                    </Link>
                </section>
            )}
            <section>
                {works.length > 0 ? (
                    <CarouselGeneric items={works} renderItem={(work) => (
                            <WorksCard key={work._id} work={work} onDelete={handleDelete} />
                        )} />
                ) : (
                    <div className="genListErrContDark">
                        <H2Fields value={`${TEXT.WORKS_NOT_FOUND}!`} className="genListErrDark" classNameH2="genListErrH2Dark" language={language} />
                        <img src="/img/not-found.png" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default WorksList;