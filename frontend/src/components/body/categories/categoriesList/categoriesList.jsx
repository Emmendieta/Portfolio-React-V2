import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context.jsx";
import { useLoading } from "../../../../context/Loading.Context.jsx";
import { useLanguage } from "../../../../context/Language.Context.jsx";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeleteCategoryById, fetchGetAllCategories, fetchUpdateCategoriesOrder } from "../categoriesLogic.js";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CategoriesCard from "../categoriesCard/categoriesCard.jsx";
import "./categoriesList.css";
import Uls from "../../generalFields/Uls/Uls.jsx";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";

function CategoriesList({ selectedCategory, onCategorySelect }) {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    //FALTAN LOS BUSCADORES;
    const [loading, setLoading] = useState(1);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const navigate = useNavigate();
    const [canCreate, setCanCreate] = useState(false);
    const { verifyPrivileges } = userVerifyPrivileges();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                startLoading();
                const result = await fetchGetAllCategories();
                if (result?.error) {
                    setCategories([]);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error?.message}` || TEXT.TEXT_ERROR_OOPS);
                    return;
                };
                const categories = result.response || [];
                const sortedCategories = [...categories].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
                setCategories(sortedCategories);
            } catch (error) {
                setCategories([]);
                console.error(`${TEXT.ERROR}: ${erro.message}` || TEXT.TEXT_ERROR_OOPS);
                await errorSweet(`${TEXT.ERROR}: ${erro.message}` || TEXT.TEXT_ERROR_OOPS);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCategories();
    }, [language, user, /* FALTAN LOS BUSCADORES (SI PONGO) */]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanCreate(false);
                return;
            };
            const allowed = await verifyPrivileges(user, "create_categories");
            setCanCreate(allowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    const handleCategoryClick = (id) => {
        if (selectedCategory === id) {
            onCategorySelect(null);
        } else {
            onCategorySelect(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELETE_CATEGORY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if (!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteCategoryById(id);
            if (result?.error) throw new Error(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${TEXT.CATEGORY}`, result?.error?.message);
            await successSweet(`${TEXT.CATEGORY} ${TEXT.DELETED}!`);
            setCategories(prev => prev.filter(category => category._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: `, error.message);
            await errorSweet(`${TEXT.ERROR}: `, error.message);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const reordered = Array.from(categories);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        const reorderedWithOrder = reordered.map((item, index) => ({ ...item, order: index }));
        setCategories(reorderedWithOrder);
        try {
            const response = await fetchUpdateCategoriesOrder(reorderedWithOrder);
            if (response?.error) await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES}`, response.error.message);
            else await successSweet(`${TEXT.REORDER_CATEGORIES}`);
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES}`, error.message);
            await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES}` + error.message);
        }
    };

    return (
        <div className="catsListCont">
            <div className="catsListDivCont">
                {canCreate && (
                    <section className="catListSectAddCont">
                        <Link to={"/categories/form/new"}>
                            <button type="button" className="btn btn-outline-success" id="btnAddCat">{`${TEXT.NEW_F} ${TEXT.CATEGORY}`}</button>
                        </Link>
                    </section>
                )}
                <section >
                    {categories.length > 0 ? (
                        <Uls list={categories} language={language} renderItem={(category) => (
                            <CategoriesCard key={category._id} category={category} onDelete={handleDelete} onClick={handleCategoryClick} 
                                isSelected={selectedCategory === category._id}/>
                        )}
                            className="catListUlsCont" classNameUl="catListUls" classnameli="catListUlsLi" />
                    ) : (
                        <div className="genListErrCont">
                            <H2Fields value={TEXT.NO_CATEGORIES_FOUND} className="genListErr" classNameH2="genListErrH2" language={language} />
                            <img src="/img/not-found.png" />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CategoriesList;