import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context.jsx";
import { useLanguage } from "../../../../context/Language.Context.jsx";
import { useLoading } from "../../../../context/Loading.Context.jsx";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import UserCard from "../usersCard/usersCard.jsx";
import { fetchDeleteUserById, fetchGellAllUsersPaginatePopulate } from "../userLogic.js";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import Inputs from "../../generalFields/Inputs/inputs.jsx";
import { Link } from "react-router-dom";
import Uls from "../../generalFields/Uls/Uls.jsx";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function UsersList() {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [searchFullName, setSearchFullName] = useState("");
    const [searchFullNameFilter, setSearchFullNameFilter] = useState("");
    const [searchDNI, setSearchDNI] = useState("");
    const [searchDNIFilter, setSearchDNIFilter] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchEmailFilter, setSearchEmailFilter] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [searchUserFilter, setSearchUserFilter] = useState("");
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
        const loadUsers = async () => {
            try {
                startLoading();
                const params = { page: 1, limit: 10, language, searchUser: searchUserFilter, searchEmail: searchEmailFilter, searchDNI: searchDNIFilter, searchFullName: searchFullNameFilter };
                const result = await fetchGellAllUsersPaginatePopulate(params);
                if (result?.error) {
                    setUsers([]);
                    setTotalPages(1);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const { docs = [], totalPages = 1 } = result.response;
                setUsers(docs);
                setTotalPages(totalPages);
            } catch (error) {
                setUsers([]);
                setTotalPages(1);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadUsers();
    }, [page, language, searchDNIFilter, searchEmailFilter, searchFullNameFilter, searchUserFilter]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if(!user) { 
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_users");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_USER,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteUserById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.USER} ${TEXT.DELETED}!`);
            setUsers(prev => prev.filter(user => user._id !== id));
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
                    <Link to={"/users/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAdd">{`${TEXT.NEW_F} ${TEXT.USER}`}</button>
                    </Link>
                </section>
            )}
            <section className="generalListSearchColumnContainer">
                <div className="generalListSearchRowSubContainer">
                    <div className="generalListSearchRow">
                        <Inputs textH2={TEXT.USER_NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m", TEXT.USER_NAME_OF_THE_USER)} value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                            <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchUserFilter(searchUser.trim()), setSearchDNI(""), setSearchDNIFilter(""), setSearchEmail(""), setSearchEmailFilter(""), setSearchFullName(""), setSearchFullNameFilter("")}}>{TEXT.SEARCH_BY_USER}</button>
                    </div>
                    <div className="generalListSearchRow">
                        <Inputs textH2={TEXT.EMAIL} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m", TEXT.EMAIL)} value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                            <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchEmailFilter(searchEmail.trim()), setSearchDNI(""), setSearchDNIFilter(""), setSearchUser(""), setSearchUserFilter(""), setSearchFullName(""), setSearchFullNameFilter("")}}>{TEXT.SEARCH_BY_EMAIL}</button>
                    </div>
                </div>
                <div className="generalListSearchRowSubContainer">
                    <div className="generalListSearchRow">
                        <Inputs textH2={TEXT.DNI} type="number" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m", TEXT.DNI)} value={searchDNI} onChange={(e) => setSearchDNI(e.target.value)} />
                            <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchDNIFilter(searchDNI), setSearchUser(""), setSearchUserFilter(""), setSearchEmail(""), setSearchEmailFilter(""), setSearchFullName(""), setSearchFullNameFilter("")}}>{TEXT.SEARCH_BY_DNI}</button>
                    </div>
                    <div className="generalListSearchRow">
                        <Inputs textH2={TEXT.FULL_NAME} type="text" cNContainer={"generalListInputsContainerRow"} cNSecTop={"generalListInputsTopRow"} cNSectBottom={"generalListInputsBottomRow"} placeHolder={TEXT.inputsText("m", TEXT.FULL_NAME)} value={searchFullName} onChange={(e) => setSearchFullName(e.target.value)} />
                            <button type="button" className="btn btn-outline-success" onClick={() => { setPage(1), setSearchFullNameFilter(searchFullName), setSearchDNI(""), setSearchDNIFilter(""), setSearchEmail(""), setSearchEmailFilter(""), setSearchUser(""), setSearchUserFilter("")}}>{TEXT.SEACH_BY_FULL_NAME}</button>
                    </div>
                </div>
            </section>
            <section className="generalListRow">
                {users.length > 0 ? (
                    <Uls list={users} lassNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} valueH1Field={`${TEXT.USERS_LIST}:`} idH1Field={"generalListH1"} language={language}
                    renderItem={(user) => (
                        <UserCard key={user._id} user={user} onDelete={handleDelete} />
                    )} />
                ): (
                    <div className="generalListErrorContainer">
                        <H2Fields value={`${TEXT.USERS_NOT_FOUND}!`} className={"generalListError"} classNameH2={"generalListErrorH2"} language={language} />
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

export default UsersList;