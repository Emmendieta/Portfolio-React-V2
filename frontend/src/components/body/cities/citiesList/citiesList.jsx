import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import { fetchDeleteCityById, fetchGetAllCitiesPaginate } from "../citiesLogic";
import { Link } from "react-router-dom";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import CitiesCard from "../citiesCard/citiesCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";

function CitiesList() {
    const { user } = useContext(UserContext);
    const [cities, setCities] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZipCode, setSearchZipCode] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ name: "", zipCode: "" });
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
        const loadCities = async () => {
            try {
                const allowed = await verifyPrivileges(user, "read_all_cities");
                if (!allowed) return;
                startLoading();
                const filters = { page, limit: 10, language };
                if (appliedFilters.name) { filters.searchName = appliedFilters.name; };
                if (appliedFilters.zipCode) { filters.zipCode = appliedFilters.zipCode; };
                const result = await fetchGetAllCitiesPaginate(filters);
                if (result?.error) {
                    setCities([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setCities(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setCities([]);
                setTotalPages(1);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCities();
    }, [page, appliedFilters, user, language]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_cities");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleSearchName = () => {
        setPage(1);
        setSearchZipCode("");
        setAppliedFilters({ name: searchName.trim(), zipCode: "" });
    };

    const handleSearchZipCode = () => {
        setPage(1);
        setSearchName("");
        setAppliedFilters({ name: "", zipCode: searchZipCode.trim() });
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_CITY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteCityById(id);
            if (result?.error) throw new Error(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.CITY} ${TEXT.DELETED}!`);
            setCities(prev => prev.filter(city => city._id !== id));
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
                    <Link to={"/cities/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddCity">{`${TEXT.NEW_F} ${TEXT.CITY}`}</button>
                    </Link>
                </section>
            )}
            <section>
                <div>
                    <Inputs textH2={TEXT.SEARCH_NAME} type="text" cNContainer={"citiesListContInput"} cNSecTop={"citiesListTopInput"} cnSectBottom={"citiesListBottonInput"}
                        placeHolder={"FALTA TEXTO PLACEHOLDER"} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <button type="button" onClick={handleSearchName} className="btn btn-outline-success">{TEXT.SEARCH_NAME}</button>
                </div>
                <div>
                    <Inputs textH2={TEXT.SEARCH_ZIPCODE} type="text" cNContainer={"citiesListContInput"} cNSecTop={"citiesListTopInput"} cnSectBottom={"citiesListBottonInput"}
                        placeHolder={"FALTA TEXTO PLACEHOLDER"} value={searchZipCode} onChange={(e) => setSearchZipCode(e.target.value)} />
                    <button type="button" onClick={handleSearchZipCode} className="btn btn-outline-success">{TEXT.SEARCH_ZIPCODE}</button>
                </div>
            </section>
            <section>
                {cities.length > 0 ? (
                    <Uls list={cities} classNameUl={"citiesListUl"} classnameli={"citiesListLi"} valueH1Field={TEXT.CITIES_LIST} idH1Field={"citiesListH1"} language={language} renderItem={(city) => (
                        <CitiesCard key={city._id} city={city} onDelete={handleDelete} />
                    )} />
                ) : (
                    <div>
                        <H2Fields value={`${TEXT.CITIES_NOT_FOUND}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
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
    );
};

export default CitiesList;