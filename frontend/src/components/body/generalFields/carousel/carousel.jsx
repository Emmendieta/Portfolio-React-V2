import { useState } from "react";
import "./carousel.css";

function Carousel({ images = [], width = 300, height = 300, clCont = "", clImgCont = "", clDivImgCont = "", clImg = "", clBtnPrev = "", clBtnNext = "", showNextPrev = true}) {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    if(!images.length || images.length === 0) return null;
    const handlePrev = () => { setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)); };
    const handleNext = () => { setCurrentIndex(prev => (prev === images.length - 1 ? 0: prev + 1 )); };

    return (
        <div className={`carousel-wrapper ${clCont}`} style={{ width, height }}>
            {showNextPrev && images.length > 1 && (<div className={`carousel-button prev ${clBtnPrev}`} onClick={handlePrev}>&#10094;</div>)}
            <div className={`carousel-image-container ${clImgCont}`}>
                <div className="carousel-image-row" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 1s ease-in-out" }}>
                    {images.map((img, index) => (
                        <div className={`carousel-image-item ${clDivImgCont}`} key={index}>
                            <img src={img} alt={`carousel-${index}`} className={clImg} onError={(e) => (e.currentTarget.src ="/img/imagen-no-disponible.png")} />
                        </div>
                    ))}
                </div>
            </div>
            {showNextPrev && images.length > 1 && (<div className={`carousel-button next ${clBtnNext}`} onClick={handleNext}>&#10095;</div>)}
        </div>
    );
};

export default Carousel;