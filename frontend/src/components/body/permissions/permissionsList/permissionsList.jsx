import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import PermissionCard from "../permissionsCard/permissionsCard";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { fetchDeletePermissionById, fetchGetAllPermissionsPaginate } from "../permissionsLogic";
import { Link, useNavigate } from "react-router-dom";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import Inputs from "../../generalFields/Inputs/inputs";
import Uls from "../../generalFields/Uls/Uls";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";

function PermissionsList() {
    const { user } = useContext(UserContext);
    const [permissions, setPermissions] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchNameFilter, setSearchNameFilter] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [searchKeyFilter, setSearchKeyFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadPermissions = async () => {
            try {
/*                 if(!user || !user.permissions.includes("read_all_permissions")) {
                    await errorSweet(TEXT.NO_ENOUGH_PRIVILEGES);
                    navigate("/forbidden");
                    return;
                } */
                startLoading();
                const params = { page, limit: 10, language, searchName: searchNameFilter, searchKey: searchKeyFilter };
                const result = await fetchGetAllPermissionsPaginate(params);
                if(result?.error) {
                    setPermissions([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setPermissions(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setPermissions([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadPermissions();
    }, [page, language, searchKeyFilter, searchNameFilter]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_permissions");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PERMISSION,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeletePermissionById(id);
            if(result?.error) return await errorSweet(`${TEXT.COULDNT_DELETE} ${TEXT.THE_M} ${TEXT.PERMISSION}. ${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.PERMISSION} ${TEXT.DELETED}`);
            setPermissions(prev => prev.filter(permission => permission._id !== id));
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
                    <Link to={"/permissions/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_M} ${TEXT.PERMISSION}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.KEY} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder="FALTA TEXTO PLACEHOLDER"/* {TEXT.inputsText("m", TEXT.KEY_OF_THE_PERMISSION)} */ value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchKeyFilter(searchKey.trim()), setSearchName(""), setSearchNameFilter("") }}>{TEXT.SEARCH_BY_KEY}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeholder="FALTA TEXTO PLACEHOLDER"/* {TEXT.inputsText("m", TEXT.NAME_OF_THE_PERMISSION)} */ value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchNameFilter(searchName.trim()), setSearchKey(""), setSearchKeyFilter("") }}>{TEXT.SEARCH_BY_NAME}</button>
                </div>
            </section>
            <section className="generalListRow">
                {permissions.length > 0 ? (
                    <Uls list={permissions} classNameUl={"generalUlListColumn"} classnameli={"generalUlListColumnLi"} valueH1Field={`${TEXT.PERMISSION_LIST}:`} idH1Field={"generalListH1"} language={language} renderItem={(permission) => (
                        <PermissionCard key={permission._id} permission={permission} onDelete={handleDelete} />
                    )} />
                ): (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.NO_PERMISSION}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language}/>
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

export default PermissionsList;