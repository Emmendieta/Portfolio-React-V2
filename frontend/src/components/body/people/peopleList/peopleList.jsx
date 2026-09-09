import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeletePersonById, fetchGetAllPeoplePaginatePopulate } from "../peopleLogic";
import PeopleCard from "../peopleCard/peopleCard";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function PeopleList() {
    const { user } = useContext(UserContext);
    const [people, setPeople] = useState([]);
    const [searchDNI, setSearchDNI] = useState("");
    const [searchDNIFilter, setSearchDNIFilter] = useState("");
    const [searchFullName, setSearchFullName] = useState("");
    const [searchFullNameFilter, setSearchFullNameFilter] = useState("")
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadPeople = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                const params = { page, limit: 10, language, searchPerson: searchFullNameFilter, searchDNI: searchDNIFilter, searchContinent: "", searchCountry: "", searchProvince: "", searchCity: "" };
                const result = await fetchGetAllPeoplePaginatePopulate(params);
                if(result?.error) {
                    setPeople([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setPeople(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setPeople([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadPeople();
    }, [page, language, searchFullNameFilter, searchDNIFilter]);

    //Verifiy Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) { 
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_people");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PERSON,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeletePersonById(id);
            if(result?.error) throw new Error(`${TEXT.COULDNT_DELETE} ${TEXT.THE_F} ${TEXT.PERSON}. ${TEXT.ERROR}: ${result?.error?.message}`);
            await successSweet(`${TEXT.PERSON} ${TEXT.DELETED}`);
            setPeople(prev => prev.filter(person => person._id !== id));
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
                    <Link to={"/people/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_F} ${TEXT.PERSON}`}</button>
                    </Link>                
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.DNI} type="number" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder={TEXT.inputsText("m", TEXT.DNI)} value={searchDNI}  onChange={(e) => setSearchDNI(e.target.value)}/>
                    <button type="button" className="btn btn-outline-success" onClick={(e) => { setPage(1), setSearchDNIFilter(searchDNI), setSearchFullName(""), setSearchFullNameFilter("")}}>{TEXT.SEARCH_BY_DNI}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.FULL_NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder={TEXT.inputsText("m", TEXT.FULL_NAME)} value={searchFullName} onChange={(e) => setSearchFullName(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchFullNameFilter(searchFullName.trim()), setSearchDNI(""), setSearchDNIFilter("")}}>{TEXT.SEACH_BY_FULL_NAME}</button>
                </div>
            </section>  
            <section className="generalListRow">
                {people.length > 0 ? (
                    <Uls list={people} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.PEOPLE_LIST}:`} idH1Field={"generalListH1"} language={language}
                    renderItem={(person) => (
                        <PeopleCard key={person._id} person={person} onDelete={handleDelete} />
                    )} />
                ): (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.NO_PERSON}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
                        <img src="/img/not-found.jpg"/>
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

export default PeopleList;