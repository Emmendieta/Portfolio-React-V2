import { useState } from "react";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import "./carouselGeneric.css";

function CarouselGeneric({ items = [], renderItem, width = "100%", height = "auto", className = "",
    showButtons = true, showCounter = true, loop = false
}) {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [currentIndex, setCurrentIndex] = useState(0);
    //if there are not element, don't show nothing:
    if(!items || items.length === 0) { return null; };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            if(prev === 0) {
                return loop ? items.length -1 : 0;
            };
            return prev -1;
        });
    };

    const handleNext = () => {
        setCurrentIndex((prev) => {
            if(prev === items.length - 1) {
                return loop ? 0 : prev;
            };
            return prev + 1;
        });
    };

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === items.length - 1;

    return (
        <div className={`genCarousel ${className}`} style={{ width, height }} > 
            {showButtons && (
                <button type="button" className="genCarousel_button genCarousel_button--prev" onClick={handlePrev} disabled={!loop && isFirst}
                    aria-label={TEXT.PREV_ELEMENT}>&#10094;</button>
            )}
            <div className="genCarousel_viewport">
                <div className="genCarousel_track" style={{ transform: `translateX( -${currentIndex * 100}%)`}} >
                    {items.map((item, index) => (
                        <div className="genCarousel_slide" key={ item?._id || index } >
                            { renderItem(item, index) }
                        </div>
                    ))}
                </div>
            </div>
            {showButtons && (
                <button type="button" className="genCarousel_button genCarousel_button--next" onClick={handleNext} disabled={ !loop && isLast } 
                    aria-label={TEXT.NEXT_ELEMENT}>&#10095;</button>
            )}
            {showCounter && (
                <div className="genCarousel_counter">
                    { currentIndex + 1 } / { items.length }
                </div>
            )}
        </div>
    );
};

export default CarouselGeneric;