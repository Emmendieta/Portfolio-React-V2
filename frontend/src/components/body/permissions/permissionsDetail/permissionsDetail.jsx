import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../../constants/selectConstLang";
import H1Fields from "../../GeneralFields/H1Fields/H1Fields";
import { FaUserEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import H2Fields from "../../GeneralFields/H2Fields/H2Fields";
import { useLoading } from "../../../../context/LoadingContext";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { fetchDeletePermissionById, fetchPermissionById } from "../PermissionsLogic";
import { RiArrowGoBackFill } from "react-icons/ri";

function PermissionDetail() {
    const { user } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [permission, setPermission] =useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const { errorSweet, successSweet, confirmSweet } = useConfirmSweet();
    const TEXT = LANG_CONST[language];
    const navigate = useNavigate();

    useEffect(() => {
        const loadPermission = async () => {
            try {
                //FALTA VALIDAR AL USUARIO
                startLoading();
                if(state?.permission) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setPermission(state.permission);
                    return;
                } else {
                    if(id !== "new") {
                        const result = await fetchPermissionById(id);
                        if(result?.error) {
                            await errorSweet(result?.error.message || TEXT.TEXT_ERROR_OOPS);
                            return;
                        };
                        const data = result.response || [];
                        setPermission(data);
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
        loadPermission();
    }, [id, state, user, language]);

    const handleDelete = async () => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PERMISSION,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            const result = await fetchDeletePermissionById(id);
            if(result?.error) throw new Error(result?.error.message || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.PERMISSION} ${TEXT.DELETED}`);
            navigate("/permissions");
        } catch (error) {
            await errorSweet(error.message);
            console.error("Error: ", error.message);
        }
    };

    if (!permission) return <p>No Permission data Available!</p>

    return (
        <div className="generalDetailContainer">
            <section className="generalDetailTitle">
                <H1Fields label={`${TEXT.PERMISSION_DETAIL}:`} language={language} />
            </section>
            <section className="generalDetailInfo">
                <H2Fields label={TEXT.ID} value={permission._id} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.KEY} value={permission.key} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.NAME} value={permission.name?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} />
                <H2Fields label={TEXT.DESCRIPTION} value={permission.description?.[language] || ""} className={"h2GeneralDetails"} classNameH2={"h2GeneralDetailsH2"} classNameLabel={"h2GeneralDetailsLabel"} language={language} /> CAMBIAR ESTE POR UN TEXT MAS LARGO
            </section>
            <section className="generalDetailBtns">
                <button className="btn btn-outline-dark" id="generalDetailBtnBack" onClick={() => navigate("/permissions")}><RiArrowGoBackFill className="iconBtnDetailsBack"/></button>
                <button className="btn btn-outline-primary" id="generalDetailBtnEdit" onClick={() => navigate(`/permissions/form/${permission._id}`, { state: { permission } })}><FaUserEdit className="iconBtnDetailsEdit" /></button>
                <button className="btn btn-outline-danger" id="generalDetailBtnDelete" onClick={handleDelete}><FaRegTrashCan className="iconBtnDetailsDelete" /></button>
            </section >
        </div >
    )
};

export default PermissionDetail;