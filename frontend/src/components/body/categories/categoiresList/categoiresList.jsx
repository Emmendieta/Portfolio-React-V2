import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User.Context";
import { useLoading } from "../../../../context/Loading.Context";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context";
import { Link, useNavigate } from "react-router-dom";
import { fetchDeleteCategoryById, fetchGetAllCategories, fetchUpdateCategoriesOrder } from "../categoriesLogic.js";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Uls from "../../generalFields/Uls/Uls.jsx";
import CategoriesCard from "../categoriesCard/categoriesCard.jsx";

function CategoriesList() {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState("");
    //FALTAN LOS BUSCADORES;
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const { errorSweet, successSweet, confirmSweet } = useSweetAlert();
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                //FALTA VALIDAR USUARIO
                startLoading();
                const result = await fetchGetAllCategories();
                if(result?.error) {
                    setCategories([]);
                    await errorSweet(`${TEXT.ERROR}: ${result?.error.message}` || `${TEXT.TEXT_ERROR_OOPS}`);
                    return;
                };
                const caegories = result.response || [];
                setCategories(categories);
            } catch (error) {
                setCategories([]);
                console.error(`${TEXT.ERROR}:`, error.message);
                await errorSweet(`${TEXT.ERROR}: ${error.message}`);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadCategories;
    }, [language, user, /* FALTAN LOS BUSCADORES (SI PONGO) */ ]);

    const handleCategoryClick = (id) => {
        if(selectedCategory == id) {
            onCategorySelect(null);
        } else {
            onCategorySelect(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await confirmSweet({
                title: TEXT.ARE_YOU_SURE,
                text: TEXT.DELELTE_CATEGORY,
                confirmButtonText: TEXT.YES,
                cancelButtonText: TEXT.NO
            });
            if(!confirmDelete) return;
            setLoading(true);
            startLoading();
            const result = await fetchDeleteCategoryById(id);
            if(result?.error) throw new Error(`${TEXT.ERROR}: ${TEXT.COULDNT_DELETE} ${TEXT.CATEGORY}`, error.message);
            await successSweet(`${TEXT.CATEGORY} ${TEXT.DELETED}!`);
            setCategories(prev => prev.filter(category => category._id !== id));
        } catch (error) {
            console.error(`${TEXT.ERROR}: `, error.message);
            await errorSweet(`${TEXT.ERROR}: ` +  error.message);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    const handleDragEnd = async (result) => {
        if(!result.destination) return;
        const reordered = Array.from(categories);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        const reorderedWithOrder = reordered.map((item, index) => ({ ...item, order: index }));
        setCategories(reorderedWithOrder);
        try {
            const response = await fetchUpdateCategoriesOrder(reorderedWithOrder);
            if(response?.error) await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES}`, response.error.message);
            else await successSweet(TEXT.REORDER_CATEGORIES);
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES} error.message`);
            await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_REORDER_CATEGORIES} error.message`);
        }
    };

    return (
        <div className="catsListCont">
            <section id="catsListTitle">
                <H2Fields value={TEXT.CATEGORIES_LIST}/>
                { user?.role === "admin" && (
                    <div className="catsListAddCont">
                        <Link to="categories/form/new" className="btn btn-outline-success" id="catsListAddBtn">
                            <IoIosAddCircleOutline className="catsListAddBtnIcon" />
                        </Link>
                    </div>
                )}
            </section>
            <section className="catsListCont">
                {categories.length > 0 ? (
                    <Uls list={categories} classNameUl="catsUl" classnameli="catsUlLi" value={`${TEXT.CATEGORIES_LIST}:`}
                        idH1Field={"catsUlH1"} language={language} renderItem={(category) => (
                            <CategoriesCard key={category._id} category={category} onDelete={handleDelete} />
                        )} />
                ): (
                    <div className="catsListErrorCont">
                        <H2Fields value={`${TEXT.ERROR}: ${TEXT.NO_CATEGORIES_FOUND}`} className="catsListErrorH2Cont" classNameH2="catsListErrorH2" language={language} />
                        <img src="/public/img/not-found.png" />
                    </div>
                )} 
            </section>
        </div>
    );
};

export default CategoriesList;