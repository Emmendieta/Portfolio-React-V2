import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { Link, useNavigate } from "react-router-dom";
import ContinentCard from "../continentsCard/continentsCard";
import { fetchDeleteContinentById, fetchGetAllContinentsPaginatePopulate, } from "../continentsLogic";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function ContinentsList() {
    const { user } = useContext(UserContext);
    const [continents, setContinents] = useState([]);
    const [searchNameInput, setSearchNameInput] = useState("");
    const [searchNameFilter, setSearchNameFilter] = useState("");
    const [searchCountryInput, setSearchCountryInput] = useState("");
    const [searchCountryFilter, setSearchCountryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    const loadCountinents = async () => {
        try {
            startLoading();
            const params = { page, limit: 10, language, searchName: searchNameFilter, searchCountry: searchCountryFilter };
            //FALTA ACA
            const result = await fetchGetAllContinentsPaginatePopulate(params);
            if (result?.error) {
                setContinents([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                return;
            };
            const { docs = [], totalPages = 1 } = result.response;
            setContinents(docs);
            setTotalPages(totalPages);
        } catch (error) {
            setContinents([]);
            setTotalPages(1);
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            console.error(`${TEXT.ERROR}: ${error.message}`);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    useEffect(() => {
        loadCountinents()
    }, [page, language, searchNameFilter, searchCountryFilter]);

    //Verify privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_continents");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user.verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_CONTINENT,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteContinentById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.CONTINENT} ${TEXT.DELETED}!`);
            setContinents(prev => prev.filter(continent => continent._id !== id));
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="generalListContainer">
            {canCreate && (
                <section className="generalListContainerBtnAdd">
                    <Link to={"/continents/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_M} ${TEXT.CONTINENT}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.SEARCH_NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder={TEXT.inputsText("m", TEXT.NAME_OF_THE_CONTINENT)} value={searchNameInput} onChange={(e) => setSearchNameInput(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchNameFilter(searchNameInput.trim()), setSearchCountryFilter(""), setSearchCountryInput("") }}>{TEXT.SEARCH_NAME}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.SEARCH_BY_COUNTRY} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder={TEXT.inputsText("m", TEXT.NAME_OF_THE_COUNTRY)} value={searchCountryInput} onChange={(e) => setSearchCountryInput(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchCountryFilter(searchCountryInput.trim()), setSearchNameFilter(""), setSearchNameInput("") }}>{TEXT.SEARCH_BY_COUNTRY}</button>
                </div>
            </section>
            <section className="generalListRow">
                {continents.length > 0 ? (
                    <Uls list={continents} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.CONTINENTS_LIST}:`} idH1Field={"generalListH1"} language={language}
                        renderItem={(continent) => (
                            <ContinentCard key={continent._id} continent={continent} onDelete={handleDelete} />
                        )} />
                ) : (
                    <div className="generalListErrorContainer">
                        <H2Fields value={TEXT.NO_CONTINENTS_FOUND} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
                        <img src="/img/not-found.jpg" />
                    </div>
                )}
            </section>
            <section className="generalListRowPaginate">
                <button type="button" disabled={page === 1} className="btn btn-outline-primary btnGeneralListPrev" onClick={() => setPage(p => p - 1)}>{TEXT.PREV}</button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page === totalPages} className="btn btn-outline-primary btnGeneralListNext" onClick={() => setPage(p => p + 1)}>{TEXT.NEXT}</button>
            </section>
        </div>
    );
};

export default ContinentsList;