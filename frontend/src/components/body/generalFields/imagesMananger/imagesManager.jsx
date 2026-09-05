import { useState } from "react";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant.js";
import { useLanguage } from "../../../../context/Language.Context.jsx";
import { useSweetAlert } from "../../../../context/SweetAlert2.Context.jsx";
import H2Fields from "../../generalFields/h2Fields/h2Fields.jsx";
import Inputs from "../../generalFields/Inputs/inputs.jsx";
import "./imagesManager.css";

// images: Array de objetos: { file?, url?, publicId?, hash?, width?, height?, isMain }
function ImagesManager({ images, setImages, genderInput = "m", textInput = "", editable = false, maxImages = Infinity, cThumbCont = "thumbnailsContainer", cThumbAddCont = "thumbnailsAddContainer",
    cThumbInput = "thumbnailsInput", idThumbBtnAdd = undefined, cThumbPrevContainer = "thumnailsPreviewImgContainer", labelH2 = "", valueH2 = "", cH2Cont = undefined, cThumbInputs = "thubmnailsInput",
    cH2ContLabel = undefined, cH2ContH2 = undefined, cThumbPrevImg = "thumbnailsImgPreview", cThumbImgContainer = "thumbnailsImgsContainer", cThumbImgBody = "thumbnailsImgBody", cImgBottonCont = "thumbnailsImgBottomCont",
    cThumbImgBodyCont = "thumbnailsImgBodyContainer", cImgDisplay = "thumbnailImageDisplay", idImgDisplay = undefined, idThumbBtnRemove = undefined, cThumbAddBody = "thumbnailsAddBtnBody" }) {
    const [inputUrl, setInputUrl] = useState("");
    const { errorSweet, successSweet } = useSweetAlert();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [inputFile, setInputFile] = useState(null);

    const handleAddImage = async () => {
        if (!editable || !inputFile) return;
        // Evitar duplicados por nombre
        if (images.length >= maxImages) {
            await errorSweet(`${TEXT.MAX_IMAGES_REACHED}!`);
            return
        }
        const duplicate = images.some(img => img.file?.name === inputFile.name);
        if (duplicate) {
            await errorSweet(TEXT.ERROR_SAME_NAME_IMAGE);
            return;
        };
        const newImage = { file: inputFile, isMain: images.length === 0 };
        setImages([...images, newImage]);
        setInputFile(null);
    };

    const handleRemoveImage = (index) => {
        if (!editable) return;
        const newImages = [...images];
        newImages.splice(index, 1);
        // Si la principal se borró, poner otra como main
        if (!newImages.some(img => img.isMain) && newImages.length > 0) newImages[0].isMain = true;
        setImages(newImages);
    };

    const handleSetMainImage = (index) => {
        if (!editable) return;
        const newImages = images.map((img, i) => ({ ...img, isMain: i === index }));
        setImages(newImages);
    };

    const previewSrc = inputFile ? URL.createObjectURL(inputFile) : null;

    return (
        <div className={`${cThumbCont} ${editable ? "editable" : "readonly"}`}>
            {editable && (
                <div className={cThumbAddBody}>
                    {images.length < maxImages && (
                        <div className={cThumbAddCont}>
                            <Inputs textH2={cThumbInput} className={cThumbInputs} type="file" accept="image/*" onChange={(e) => setInputFile(e.target.files[0])} />
                            <button type="button" className="btn btn-outline-success btnThumbnailAdd" id={idThumbBtnAdd} onClick={handleAddImage}>{TEXT.ADD_IMAGE}</button>
                        </div>
                    )}
                    {previewSrc && (
                        <div className={cThumbPrevContainer}>
                            <H2Fields label={labelH2} value={valueH2} className={cH2Cont} classNameLabel={cH2ContLabel} classNameH2={cH2ContH2} language={language} />
                            <img src={previewSrc || "/img/imagen-no-disponbible.png"} alt="preview" className={cThumbPrevImg} onError={e => e.currentTarget.src = "/img/imagen-no-disponible.png"} />
                        </div>
                    )}
                </div>
            )}
            <div className={cThumbImgContainer}>
                {images.length > 0 && (
                    <div className={cThumbImgBody}>
                        {images.map((img, index) => {
                            const src = img.file ? URL.createObjectURL(img.file) : img.url;
                            return (
                                <div key={index} className={cThumbImgBodyCont}>
                                    <img className={cImgDisplay} id={idImgDisplay} src={src || "/img/imagen-no-disponible.png"} alt={`thumbnail ${index + 1}`} onError={e => e.currentTarget.src = "/img/imagen-no-disponible.png"} />
                                    {editable && (
                                        <div className={cImgBottonCont}>
                                            <button type="button" className="btn btn-outline-danger btnThumbnailRemove" onClick={() => handleRemoveImage(index)}>{TEXT.REMOVE}</button>
                                            {!img.isMain && (
                                                <button type="button" className="btn btn-outline-primary btnThumbnailPrimary" onClick={() => handleSetMainImage(index)}>{TEXT.SET_PRIMARY}</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagesManager;