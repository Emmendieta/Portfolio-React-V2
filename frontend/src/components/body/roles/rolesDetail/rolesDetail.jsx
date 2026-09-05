import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../../context/LoadingContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang";
import H1Fields from "../../GeneralFields/H1Fields/H1Fields";
import H2Fields from "../../GeneralFields/H2Fields/H2Fields";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchDeleteRoleById, fetchRolePopulateById } from "../RolesLogic";
import Ul from "../../GeneralFields/Ul/Ul";
import { RiArrowGoBackFill } from "react-icons/ri";

function RoleDetail() {
    const { user } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRole = async () => {
            try {
                startLoading();
                if(state?.role) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setRole(state.role);
                    return;
                } else {
                    if(id !== "new") {
                        const result = await fetchRolePopulateById(id);
                        if(result?.error) {
                            await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        const data = result.response || [];
                        setRole(data);
                    };
                }
            } catch (error) {
                await errorSweet(error.message);
                console.error("Error: ", error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadRole();
    }, [id, state, user, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_ROLE,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            const result = await fetchDeleteRoleById(id);
            if(result?.error) {
                await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                console.error("Error: ", error.message);
            };
            await successSweet(`${TEXT.ROLE} ${TEXT.DELETED}`);
            navigate("/roles");
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        }
    };

    if(!role) return <p>No Role Data Available!</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={`${TEXT.ROLE_DETAILS}:`} language={language} />
            </section>
            <section className="generalDetailInfo">
                <H2Fields label={TEXT.ID} value={role._id} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.NAME} value={role.role?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
            </section>
            <section id="generaDatailListContainter">
                {role.permissions?.length > 0 ? (
                    <Ul list={role.permissions} classNameUl={"listGeneralDetailsUl"} classnameli={"listGeneralDetailsLi"} valueH1Field={`${TEXT.PERMISSION_LIST}:`} idH1Field={"listGeneralDetailsH1"} language={language} renderItem={(permission) => (
                        <H2Fields label={`${TEXT.NAME} ${TEXT.PERMISSION}`} value={permission.name?.[language] || ""}className={"listGeneralDetailsH2ContainerColumn"} classNameLabel={"listGeneralDetailsH2LabelColumn"} classNameH2={"listGeneralDetailsH2ValueColumn"} language={language} />
                )} />
                ): (<p>{TEXT.WITHOUT} {TEXT.PERMISSIONS_ASSIGNED} CORREGIR ESTILOS</p>)}
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/roles")}><RiArrowGoBackFill className="iconBtnDetailsBack" /></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={() => navigate(`/roles/form/${role._id}`, { state: { role }})}><FaUserEdit className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete"><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section>
        </div>
    );
};

export default RoleDetail;