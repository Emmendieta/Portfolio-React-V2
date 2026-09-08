import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import WorksCard from "../worksCard/worksCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { fetchDeleteWorkById, fetchGetAllWorksPaginatePopulate } from "../worksLogis";
import CarouselGeneric from "../../generalFields/carouselGeneric/carouselGeneric";
import "./worksList.css";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

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
            await successSweet(`FALTA TEXTO WORK DELETED!`);
            setWorks(prev => prev.filter(work => work._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    /*return (
        <div>
            <section>
                <Link to={"/works/form/new"}>
                    <button type="button" className="btn btn-outline-success" id="btnAddWork">{`${TEXT.NEW_M} ${TEXT.WORK}`}</button>
                </Link>
            </section>
            <section>
                <div>
                    <Inputs textH2={TEXT.JOB_TITLE} type="text" cNContainer="" cNSecTop="" cnSectBottom="" placeHolder="FALTA TEXTO PLACEHOLDER" value={searchByJobTitle} onChange={(e) => setSearchByJobTitle(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={(e) => { setPage(1); setSearchByJobTitle(searchByJobTitle); setSearchByCompany("") }}>{TEXT.SEARCH_BY_JOB_TITLE}</button>
                </div>
                <div>
                    <Inputs textH2={TEXT.COMPANY} type="text" cNContainer="" cNSecTop="" cnSectBottom="" placeHolder="FALTA TEXTO PLACEHOLDER" value={searchByCompany} onChange={(e) => setSearchByCompany(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={(e) => { setPage(1); setSearchByCompany(searchByCompany); setSearchByJobTitle("") }} >{TEXT.SEARCH_BY_COMPANY}</button>
                </div>
            </section>
            <section>
                {works.length > 0 ? (
                    <Uls list={works} classNameUl="" classnameli="" valueH1Field="FALTA TEXTO WORKS LIST:" idH1Field={""} language={language}
                        renderItem={(work) => (
                            <WorksCard key={work._id} work={work} onDelete={handleDelete} />
                        )} />
                ): (
                    <div>
                        <H2Fields value={`${TEXT.WORKS_NOT_FOUND}!`} className="generalListError" classNameH2="generalListErrorH2" language={language} />
                        <img src="/img/not-found.jpg" />
                    </div>
                )}
            </section>
            <section>
                <button type="button" disabled={page === 1} className="btn btn-outline-primary btnGeneralListPrev" onClick={() => setPage(p => p - 1)}>{TEXT.PREV}</button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page === totalPages} className="btn btn-outline-primary btnGeneralListNext" onClick={() => setPage(p => p + 1)}>{TEXT.NEXT}</button>
            </section>
        </div>
    );*/

    return (
        <div className="workListDivCont">
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