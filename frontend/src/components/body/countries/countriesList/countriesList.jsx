import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { Link, useNavigate } from "react-router-dom";
import CountryCard from "../countriesCard/countriesCard";
import { fetchDeleteCountryById, fetchGetAllCountriesPaginatePopulate } from "../countriesLogic";
import Inputs from "../../generalFields/Inputs/inputs";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function CountriesList() {
    const { user } = useContext(UserContext);
    const [countries, setCountries] = useState([]);
    const [searchNameInput, setSearchNameInput] = useState("");
    const [searchNameFilter, setSearchNameFilter] = useState("");
    const [searchProvinceInput, setSearchProvinceInput] = useState("");
    const [searchProvinceFilter, setSearchProvinceFilter] = useState("");
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

    useEffect(() => {
        const loadCountries = async () => {
            try {
                startLoading();
                const params = { page, limit: 10, language, searchName: searchNameFilter, searchProvince: searchProvinceFilter };
                const result = await fetchGetAllCountriesPaginatePopulate(params);
                if (result?.error) {
                    setCountries([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setCountries(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setCountries([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
                console.error(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCountries();
    }, [page, language, searchNameFilter, searchProvinceFilter]);

    //Verify Privileges:
useEffect(() => {
    const checkPrivileges = async () => {
        if (!user) {
            setCanCreate(false);
            return;
        };
        try {
            const allowed = await verifyPrivileges(user, "create_countries");
            setCanCreate(allowed);
        } catch (error) {
            console.error("Error verifying privileges:", error);
            setCanCreate(false);
        }
    };
    checkPrivileges();
}, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_COUNTRY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteCountryById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${TEXT.THE_M} ${TEXT.COUNTRY}`);
            await successSweet(`${TEXT.COUNTRY} ${TEXT.DELETED}`);
            setCountries(prev => prev.filter(country => country._id !== id));
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="generalListContainer">
            {canCreate && (
                <section className="generalListContainerBtnAdd">
                    <Link to={"/countries/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_M} ${TEXT.COUNTRY}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.SEARCH_NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m",TEXT.NAME_OF_THE_COUNTRY)} value={searchNameInput} onChange={(e) => setSearchNameInput(e.target.value)} />
                    <button type="button" onClick={() => { setPage(1), setSearchNameFilter(searchNameInput.trim()), setSearchProvinceFilter(""), setSearchProvinceInput("") }} className="btn btn-outline-success">{TEXT.SEARCH_NAME}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.SEARCH_BY_PROVINCE} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m",TEXT.NAME_OF_THE_PROVINCE)} value={searchProvinceInput} onChange={(e) => setSearchProvinceInput(e.target.value)} />
                    <button type="button" onClick={() => { setPage(1), setSearchProvinceFilter(searchProvinceInput.trim()), setSearchNameFilter(""), setSearchNameInput("") }} className="btn btn-outline-success">{TEXT.SEARCH_BY_PROVINCE}</button>
                </div>
            </section>
            <section className="generalListRow">
                {countries.length > 0 ? (
                    <Uls list={countries} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.COUNTRY_LIST}:`} idH1Field={"generalListH1"} language={language} renderItem={(country) => (
                        <CountryCard key={country._id} country={country} onDelete={handleDelete} />
                    )} />
                ) : (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.NO_COUNTRY}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
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

export default CountriesList;