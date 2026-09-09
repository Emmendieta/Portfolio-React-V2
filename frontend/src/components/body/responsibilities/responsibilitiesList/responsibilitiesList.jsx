import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import { Link } from "react-router-dom";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import ResponsibilitiesCard from "../responsibilitiesCard/responsibilitiesCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { fetchDeleteResponsibilityById, fetGetAllResponsibilitiesPaginate } from "../responsibilitiesLogic";

function ResponsibilitiesList() {
    const { user } = useContext(UserContext);
    const [responsibilities, setResponsibilities] = useState("");
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
        const loadResponsibilities = async () => {
            try {
                /* const allowed = await verifyPrivileges(user, "read_all_responsibilities");
                if(!allowed) return; */
                startLoading();
                const filters = { page, limit: 10, language };
                if(appliedFilters.name) { filters.searchName = appliedFilters.name };
                const result = await fetGetAllResponsibilitiesPaginate(filters);
                if(result?.error) {
                    setResponsibilities([]);
                    setTotalPages(1);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const { docs = [], totalPages = 1 } = result.response;
                setResponsibilities(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setResponsibilities([]);
                setTotalPages(1);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadResponsibilities();
    }, [page, appliedFilters, user, language]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_responsibilities");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleSearchName = () => {
        setPage(1);
        setAppliedFilters({ name: searchName.trim() });
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_RESPONSIBILITY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteResponsibilityById(id);
            if(result?.error) return await errorSweet(` ${TEXT.COULDNT_DELETE} ${TEXT.THE_F} ${TEXT.RESPONSIBILITY}. ${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.RESPONSIBILITY} ${TEXT.DELETED}!`);
            setResponsibilities(prev => prev.filter(responsibility => responsibility._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div>
            {canCreate && (
                <section>
                    <Link to={"/responsibilities/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddResponsibility">{`${TEXT.NEW_F} ${TEXT.RESPONSIBILITY}`}</button>
                    </Link>
                </section>
            )}
            <section>
                <div>
                    <Inputs textH2={TEXT.NAME} type="text" cNContainer="" cNSecTop="" cnSectBottom=""
                        placeHolder={TEXT.inputsText("m", TEXT.RESPONSIBILITIES_NAME)} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <button type="button" onClick={handleSearchName} className="btn btn-outline-success">{TEXT.SEARCH_NAME}</button>
                </div>
            </section>
            <section>
                {responsibilities.length > 0 ? (
                    <Uls list={responsibilities} className="" classnameli="" valueH1Field="FALTA TEXT H1" idH1Field={""} language={language} renderItem={(responsibility) => (
                        <ResponsibilitiesCard key={responsibility._id} responsibility={responsibility} onDelete={handleDelete} />
                    )} />
                ): (
                    <div>
                        <H2Fields value={`${TEXT.RESPONSIBILITIES_NOT_FOUND}!`} className="" classNameH2="" language={language} />
                    </div>
                )}
            </section>
            <section>
                <button type="button" disabled={page === 1} className="btn btn-outline-primary btnGeneralListPrev" onClick={() => setPage(p => p - 1)}>{TEXT.PREV}</button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page === totalPages} className="btn btn-outline-primary btnGeneralListNext" onClick={() => setPage(p => p + 1)}>{TEXT.NEXT}</button>
            </section>
        </div>
    );
};

export default ResponsibilitiesList;