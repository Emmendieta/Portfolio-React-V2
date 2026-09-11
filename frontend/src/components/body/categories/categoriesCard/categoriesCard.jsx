import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../../context/User.Context.jsx";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import ImagesManager from "../../generalFields/imagesMananger/imagesManager.jsx";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Carousel from "../../generalFields/carousel/carousel.jsx";
import { userVerifyPrivileges } from "../../../../helpers/privileges.helper.js";
import "./categoriesCard.css";

function CategoriesCard({ category, onDelete, onClick, isSelected, isDraggable }) {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);
    const TEXT = LANG_CONST[language];
    const { verifyPrivileges } = userVerifyPrivileges();
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { setVisible(entry.isIntersecting); });
        }, { threshold: 0.1 });
        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    useEffect(() => {
        setImages(category.images || []);
    }, [category.images]);

    //Verify Privileges:
    useEffect(() => {
        const checkPrivileges = async () => {
            if (!user) {
                setCanEdit(false);
                setCanDelete(false);
                return;
            };
            const [editAllowed, deleteAllowed] = await Promise.all([
                verifyPrivileges(user, "update_categories"), 
                verifyPrivileges(user, "delete_categories")
            ]);
            setCanEdit(editAllowed);
            setCanDelete(deleteAllowed);
        };
        checkPrivileges();
    }, [user, verifyPrivileges]);

    return (
        <div key={category._id} className={`catCard ${visible ? "fade-in" : ""} ${isSelected ? "catCardSelected": ""}`} onClick={() => onClick(category._id)}>
            <section className="catCardBodySect">
                <div className="catCardImagesSect">
                    <Carousel type="category" id={category._id} images={category.images?.map(img => img.url) || []} width={75} height={75} showNextPrev={false}
                        clCont="" clImgCont="" clImg="catCardImg" clDivImgCont="" clBtnPrev="" clBtnNext="" />
                </div>
                <div className="catCardBody">
                    <H2Fields label={""} value={category.name?.[language] || ""} language={language}
                        className={"catCardH2Fields"} classNameLabel={"catCardH2Label"} classNameH2={"lightCardH2TextNoPadding"} />
                </div>
            </section>
            {(canEdit || canDelete) && (
                <section className="catCardEditSec">
                    {canEdit && (
                        <Link to={`/categories/form/${category._id}`} id="catCardEdit" className="btn btn-outline-primary btn-sm" 
                            onClick={(e) => e.stopPropagation()}>
                            <FaPen />
                        </Link>
                    )}
                    {canDelete && (
                        <button className="btn btn-outline-danger btn-sm" id="catCardDelete"  onClick={(e) => { e.stopPropagation(); onDelete(category._id)}}>
                            <FaRegTrashCan />
                        </button>
                    )}
                </section>
            )}
        </div>
    );
};

export default CategoriesCard;