import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context.jsx";
import { useLoading } from "../../../../context/Loading.Context.jsx";
import { useLanguage } from "../../../../context/Language.Context.jsx";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import { Link, useNavigate } from "react-router-dom";
import RoleCard from "../rolesCard/rolesCard.jsx";
import { fetchDeleteRoleById, fetchGetAllRolesPaginatePopulate } from "../rolesLogic.js";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import Inputs from "../../generalFields/Inputs/inputs.jsx";
import Uls from "../../generalFields/Uls/Uls.jsx";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function RoleList() {
    const { user } = useContext(UserContext);
    const [roles, setRoles] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchNameFilter, setSearchNameFilter] = useState("");
    const [searchPermission, setSearchPermission] = useState("");
    const [searchPermissionFilter, setSearchPermissionFilter] = useState("");
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
        const loadRoles = async () => {
            try {
                startLoading();
                const params = { page, limit: 10, language, searchRole: searchNameFilter, searchPermission: searchPermissionFilter };
                const result = await fetchGetAllRolesPaginatePopulate(params);
                if(result?.error) {
                    setRoles([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result;
                setRoles(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setRoles([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadRoles();
    }, [page, language, searchNameFilter, searchPermissionFilter]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) { 
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_roles");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_ROLE,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteRoleById(id);
            if(result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.ROLE} ${TEXT.DELETED}`);
            setRoles(prev => prev.filter(role => role._id !== id));
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            console.error(`${TEXT.ERROR}: ${error.message}`);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="generalListContainer">
            {canCreate && (
                <section className="generalListContainerBtnAdd">
                    <Link to={"/roles/form/new"}>
                        <button type="button" className="btn btn-outline-success">{`${TEXT.NEW_M} ${TEXT.ROLE}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchRowContainer">
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_ROLE)} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchNameFilter(searchName.trim()), setSearchPermissionFilter(""), setSearchPermission("")}}>{TEXT.SEARCH_NAME}</button>
                </div>
                <div className="generalListSearchRow">
                    <Inputs textH2={TEXT.PERMISSION} cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} type="text" placeHolder={TEXT.inputsText("m", TEXT.NAME_OF_THE_PERMISSION)} value={searchPermission} onChange={(e) => setSearchPermission(e.target.value)} />
                    <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchPermissionFilter(searchPermission.trim()), setSearchNameFilter(""), setSearchName("")}}>{TEXT.SEARCH_BY_NAME_OF_THE_PERMISSION}</button>
                </div>
            </section>
            <section className="generalListRow">
                {roles.length > 0 ? (
                    <Uls list={roles} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.ROLE_LIST}:`} idH1Field={"generalListH1"} language={language} renderItem={(role) => (
                        <RoleCard key={role._id} role={role} onDelete={handleDelete} />
                    )} />
                ): (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.ROLES_NOT_FOUND}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language}/>
                        <img src="/img/not-found.jpg"/>
                    </div>
                )}
            </section>
        </div>
    );
}; 

export default RoleList;