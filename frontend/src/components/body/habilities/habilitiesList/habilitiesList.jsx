import { useContext } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useState } from "react";
import { useLoading } from "../../../../context/Loading.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import HabilitiesCard from "../habilitiesCard/habilitiesCard";
import { fetchDeleteHabilityById, fetchGetAllHabilitiesPaginate } from "../habilitiesLogic";

function HabilitiesList() {
    const { user } = useContext(UserContext);
    const [habilities, setHabilites] = useState("");
    const [searchName, setSearchName] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ name: "" });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadHabilites = async () => {
            try {
                /* 
                const allowed = await verifyPrivileges(user, "read_all_habilites");
                if(!allowed) return;
                */
                startLoading();
                const filters = { page: 1, limit: 10, language };
                if (appliedFilters.name) { filters.searchName = appliedFilters.name };
                const result = await fetchGetAllHabilitiesPaginate(filters);
                if (result?.error) {
                    setHabilites([]);
                    setTotalPages(1);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const { docs = [], totalPages = 1 } = result.response;
                setHabilites(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setHabilites([]);
                setTotalPages(1);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadHabilites();
    }, [page, appliedFilters, user, language]);

    const handleSearchName = () => {
        setPage(1);
        setAppliedFilters({ name: searchName.trim() });
    };

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_habilities");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_HABILITY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteHabilityById(id);
            if (result?.error) await errorSweet(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${TEXT.THE_F} ${TEXT.HABILITY}. ${TEXT.ERROR}: ${result?.error?.message}`);
            await successSweet(`${TEXT.HABILITY} ${TEXT.DELETED}!`);
            setHabilites(prev => prev.filter(hability => hability._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}`);
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div>
            {canCreate && (
                <section>
                    <Link to={"/habilities/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddHability">{`${TEXT.NEW_F} ${TEXT.HABILITY}`}</button>
                    </Link>
                </section>
            )}
            <section>
                <div>
                    <Inputs textH2={TEXT.NAME} type="text" cnContainer={""} cNSecTop={""} cnSectBottom={""}
                        placeHolder={TEXT.inputsTEXT("m", TEXT.NAME_OF_THE_HABILITY)} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <button type="button" onClick={handleSearchName} className="btn btn-outline-success">{TEXT.SEARCH_NAME}</button>
                </div>
            </section>
            <section>
                {habilities.length > 0 ? (
                    <Uls list={habilities} className={""} classnameli={""} valueH1Field="FALTA TEXTO H1" idH1Field={""} language={language} renderItem={(hability) => (
                        <HabilitiesCard key={hability._id} hability={hability} onDelete={handleDelete} />
                    )} />
                ) : (
                    <div>
                        <H2Fields value={`${TEXT.HABILITIES_NOT_FOUND}!`} className={""} classNameH2={""} language={language} />
                        <img src="/img/not-found.jpg" />
                    </div>
                )}
            </section>
            <section>
                <button type="button" disabled={page === 1} className="btn btn-outline-primary btnGeneralListPrev" onClick={() => setPage(p => p - 1)}>{TEXT.PREV}</button>
                <span>{page} / {totalPages}</span>
                <buton type="button" disabled={page === totalPages} className="btn btn-outline-primary btnGeneralListNext" onClick={() => setPage(p => p + 1)}>{TEXT.NEXT}</buton>
            </section>
        </div>
    );
};

export default HabilitiesList;