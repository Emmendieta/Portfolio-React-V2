import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context.jsx";
import { useLoading } from "../../../../context/Loading.Context.jsx";
import { useLanguage } from "../../../../context/Language.Context.jsx";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import { Link, useNavigate } from "react-router-dom";
import ProvinceCard from "../provincesCard/provincesCard.jsx";
import { fetchDeleteProvinceById, fetchGetAllProvincesPaginatePopulate } from "../provincesLogic.js";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import Inputs from "../../generalFields/Inputs/inputs.jsx";
import Uls from "../../generalFields/Uls/Uls.jsx";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function ProvincesList() {
    const { user } = useContext(UserContext);
    const [provinces, setProvinces] = useState([]);
    const [searchNameInput, setSearchNameInput] = useState("");
    const [searchNameFilter, setSearchNameFilter] = useState("");
    const [searchCityInput, setSearchCityInput] = useState("");
    const [searchCityFilter, setSearchCityFilter] = useState("");
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
        const loadProvinces = async () => {
            try {
                startLoading();
                const params = { page, limit: 10, language, searchName: searchNameFilter, searchCity: searchCityFilter };
                const result = await fetchGetAllProvincesPaginatePopulate(params);
                if (result?.error) {
                    setProvinces([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setProvinces(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setProvinces([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProvinces();
    }, [language, page, searchNameFilter, searchCityFilter]);

    //Verify privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_provinces");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PROVINCE,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            })
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteProvinceById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${THE_F} ${TEXT.PROVINCE}. ${TEXT.ERROR}: ${result?.error?.message}`);
            await successSweet(`${TEXT.PROVINCE} ${TEXT.DELETED}!`);
            setProvinces(prev => prev.filter(province => province._id !== id));
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
                    <Link to={"/provinces/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_F} ${TEXT.PROVINCE}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder= "FALTA EL TEXTO DEL PLACEHOLDER" /* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PROVINCE)} */ value={searchNameInput} onChange={(e) => setSearchNameInput(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchNameFilter(searchNameInput.trim()), setSearchCityFilter(""), setSearchCityInput("") }}>{TEXT.SEARCH_NAME}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={`${TEXT.CITY}`} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder= "FALTA EL TEXTO DEL PLACEHOLDER" /* {TEXT.inputsText("m", TEXT.NAME_OF_THE_CITY)} */ value={searchCityInput} onChange={(e) => setSearchCityInput(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchCityFilter( searchCityInput.trim()), setSearchNameFilter(""), setSearchNameInput("") }}>{TEXT.SEARCH_BY_CITY}</button>
                </div>
            </section>
            <section className="generalListRow">
                {provinces.length > 0 ? (
                    <Uls list={provinces} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.PROVINCE_LIST}:`} idH1Field={"generalListH1"} language={language}
                    renderItem={(province) => (
                        <ProvinceCard key={province._id} province={province} onDelete={handleDelete} />
                    )} />
                ): (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.NO_PROVINCE}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
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

export default ProvincesList;