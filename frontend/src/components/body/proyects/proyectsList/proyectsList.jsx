import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeleteProyectById, fetchGetAllProyectsPopulate, fetchGetAllProyectsPopulateFilter, fetchGetAllProyectsPopulatePaginate } from "../proyectsLogic";
import ProyectsCard from "../proyectsCard/proyectsCard";
import H2Fields from "../../generalFields/h2Fields/h2Fields";
import CarouselGeneric from "../../generalFields/carouselGeneric/carouselGeneric";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper";
import H1Fields from "../../generalFields/h1Fields/h1fields";
import "./proyectsList.css";

function ProyectsList({ selectedCategory }) {
    const { user } = useContext(UserContext);
    const [proyects, setProyects] = useState([]);
    const [searchByName, setSearchByName] = useState("");
    const [searchByCompany, setSearchByCompany] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, confirmSweet, successSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();
    useEffect(() => {
        const loadProyects = async () => {
            try {
                //FALTA VALIDAR USUARIO
                startLoading();
                const result = await fetchGetAllProyectsPopulateFilter(selectedCategory);
                if (result?.error) {
                    setProyects([]);
                    return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                };
                const proyects = result.response || [];
                const sortedProyects = [...proyects].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setProyects(sortedProyects);
            } catch (error) {
                setProyects([]);
                console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProyects();
    }, [user, language, selectedCategory]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_proyects");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_PROYECT,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteProyectById(id);
            if (result?.error) return await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
            await successSweet(`${TEXT.PROYECT} ${TEXT.DELETED}!`);
            setProyects(prev => prev.filter(proyect => proyect._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    return (
        <div className="proyListDivCont">
            <section className="proListTitleCont">
                <H1Fields value={`${TEXT.PROYECTS}:`} language={language} clH1Cont="proListH1Cont" clH1Text="proListH1Text" />
            </section>
            {canCreate && (
                <section className="proyListSectAddCont">
                    <Link to={"/proyects/form/new"}>
                        <button type="button" className="btn btn-outline-success" id="btnAddProyect">{`${TEXT.NEW_M} ${TEXT.PROYECT}`}</button>
                    </Link>
                </section>
            )}
            <section>
                {proyects.length > 0 ? (
                    <CarouselGeneric items={proyects} renderItem={(proyect) => (
                        <ProyectsCard key={proyect._id} proyect={proyect} onDelete={handleDelete} />
                    )} />
                ) : (
                    <div className="genListErrCont">
                        <H2Fields value={`${TEXT.NO_PROYECT_FOUND}!`} className="genListErr" classNameH2="genListErrH2" language={language} />
                        <img src="/img/not-found.png" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProyectsList;