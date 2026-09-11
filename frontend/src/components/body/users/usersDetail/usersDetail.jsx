import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang";
import H1Fields from "../../GeneralFields/H1Fields/H1Fields";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import H2Fields from "../../GeneralFields/H2Fields/H2Fields";
import { useLoading } from "../../../../context/LoadingContext";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchDeleteUserById, fetchUserByIdPopulate } from "../UserLogic";
import Ul from "../../GeneralFields/Ul/Ul";
import { RiArrowGoBackFill } from "react-icons/ri";
import CheckBox from "../../GeneralFields/Inputs/CheckBox/CheckBox";
import Carousel from "../../GeneralFields/Carousel/Carousel";

function UserDetail() {
    const { user: currentUser } = useContext(UserContext);
    const { id } = useParams();
    const { language } = useLanguage();
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [allPermissions, setAllPermissions] = useState([]);
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const TEXT = LANG_CONST[language];

    useEffect(() => {
        const loadUser = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                await new Promise(resolve => setTimeout(resolve, 600));
                let data = null;
                if (state?.user) {
                    data = state.user;
                    setUser(data);
                    const result = await fetchUserByIdPopulate(data._id);
                    if(result?.error) {
                        await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                        return;
                    };
                    data = result.response || data;
                    setUser(data);
                } else {
                    if (id !== "new") {
                        const result = await fetchUserByIdPopulate(id);
                        if (result?.error) {
                            await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        data = result.response || [];
                        setUser(data);
                    };
                };
                if (data) {
                    let permissionMap = new Map();
                    data.roles?.forEach(role => {
                        role.permissions?.forEach(perm => {
                            permissionMap.set(perm._id, perm);
                        });
                    });
                    data.extraPermission?.forEach(perm => {
                        permissionMap.set(perm._id, perm);
                    });
                    setAllPermissions(Array.from(permissionMap.values()));
                };
            } catch (error) {
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadUser();
    }, [id, currentUser, state, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_USER,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            const result = await fetchDeleteUserById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.USER} ${TEXT.DELETED}`);
            navigate("/users");
        } catch (error) {
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        }
    };

    if (loading || !user) return <p>Loading user...</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={`${TEXT.USER_DETAILS}:`} language={language} />
            </section>
            <section className="generalDetailInfoRow">
                <div id="generalDetailInfoRowSubCont">
                    <H2Fields label={TEXT.ID} value={user._id} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.USER_NAME} value={user.user} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.EMAIL} value={user.email} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.PASSWORD} value={user.password} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <CheckBox name="active" textH2={`${TEXT.ACTIVE}?:`} checked={user.active} disabled={true} clCheckCont = {"detailsCheckCont"} clCheckH2 = {"detailsCheckH2"} clCheckInput= {"detailsCheckCheck"}/>
                    <div id="generalCardContainerCarousel">
                        <Carousel type="user" id={user._id} images={user.people?.thumbnails} width={300} height={300} clCont="generalCarouselCont" clImgCont="generalCarouselImgCont" clDivImgCon="generalCarouselDivImgCon"
                            clImg="generalCarouselImg" clBtnPrev="generalCarouselBtnPrev" clBtnNext="generalCarouselBtnNext" />
                    </div>
                </div>
                <div id="generalDetailInfoRowSubCont">
                    <H2Fields label={`${TEXT.ID} ${TEXT.PERSON}`} value={user.people?._id} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.FIRST_NAME} value={user.people.firstName} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.LAST_NAME} value={user.people.lastName} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.DNI} value={user.people.dni} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.CUIL} value={user.people.cuil} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.BIRTHDAY} value={user.people.birthday.slice(0, 10)} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.PHONE} value={user.people.phone}className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.JOB_TITLE} value={user.people.jobTitle?.[language] || ""} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.STREET_ADDRESS} value={user.people.address.street} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.NUMBER} value={user.people.address.number} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.FLOOR} value={user.people.address.floor || "-"} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.APARMENT} value={user.people.address.aparment || "-"} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.CITY} value={user.people.cities?.name?.[language] || ""} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.PROVINCE} value={user.people.provinces?.name?.[language] || ""} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.COUNTRY} value={user.people?.countries?.name?.[language] || ""} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                    <H2Fields label={TEXT.CONTINENT} value={user.people?.continents?.name?.[language] || ""} className={"h2GeneralDetailsRow"} classNameH2={"h2GeneralDetailsH2Row"} classNameLabel={"h2GeneralDetailsLabelRow"} language={language} />
                </div>
            </section>
            <section className="generalDetailsUlContainer">
                <div id="generalCardBodyUlColumn">
                    {user.roles.length > 0 ? (
                        <Ul list={user.roles || []} valueH1Field={`${TEXT.ROLES}:`} className={"detailsUlCont"} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} idH1Field={"generalListH1"} renderItem={(role) => (                            <H2Fields value={role.role?.[language]} className={"divH2CardUlCont"} classNameLabel={"divH2CardUlLabel"} />
                        )} />
                    ): (<p>{TEXT.ROLES_NOT_FOUND}</p>)}
                </div>
                <div id="generalCardBodyUlColumn">
                    {allPermissions.length > 0 ? (
                        <Ul list={allPermissions || []} valueH1Field={`${TEXT.PERMISSIONS}:`} language={language} className={"detailsUlCont"} classNameUl={"generalUlListRow"} classnameli={"generalUlListRowLi"} idH1Field={"generalListH1"}renderItem={(permission) => (
                            <H2Fields value={permission.name?.[language]} className={"divH2CardUlCont"} classNameLabel={"divH2CardUlLabel"} />
                        )} />   
                    ): ( <p>{TEXT.NO_PERMISSION}</p>)}
                </div>
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/users")}><RiArrowGoBackFill className="iconBtnDetailsBack" /></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={() => navigate(`/users/form/${user._id}`, { state: { user } })}><FaUserEdit className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete" onClick={handleDelete}><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section>
        </div>
    );
};

export default UserDetail;