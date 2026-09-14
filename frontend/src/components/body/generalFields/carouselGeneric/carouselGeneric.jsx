import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../../context/Language.Context";
import { LANG_CONST } from "../../../../constants/SelectLang.Constant";
import "./carouselGeneric.css";

function CarouselGeneric({ items = [], renderItem, width = "100%", height = "auto", className = "",
    showButtons = true, showCounter = true, loop = false
}) {
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(null);
    const slideRefs = useRef([]);
    //if there are not element, don't show nothing:
    if (!items || items.length === 0) { return null; };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            if (prev === 0) {
                return loop ? items.length - 1 : 0;
            };
            return prev - 1;
        });
    };

    const handleNext = () => {
        setCurrentIndex((prev) => {
            if (prev === items.length - 1) {
                return loop ? 0 : prev;
            };
            return prev + 1;
        });
    };

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === items.length - 1;

    useEffect(() => {
        const currentSlide = slideRefs.current[currentIndex];
        if (!currentSlide) return;
        const updateHeight = () => {
            const newHeight = currentSlide.getBoundingClientRect().height;
            if (newHeight > 0) {
                setCarouselHeight(newHeight);
            };
        };
        updateHeight();
        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });
        resizeObserver.observe(currentSlide);
        window.addEventListener("resize", updateHeight);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, [currentIndex, items, language]);

    const viewportHeight = height !== "auto" ? height: carouselHeight > 0 ? `${carouselHeight}px`: "auto";

    /*return (
        <div className={`genCarousel ${className}`} style={{ width, height: viewPortHeight }} >
            {showButtons && (
                <button type="button" className="genCarousel_button genCarousel_button--prev" onClick={handlePrev} disabled={!loop && isFirst}
                    aria-label={TEXT.PREV_ELEMENT}>&#10094;</button>
            )}
            <div className="genCarousel_viewport" style={{ height: height !== "auto" ? height : carouselHeight ? `${carouselHeight}px` : "auto" }}>
                <div className="genCarousel_track" style={{ transform: `translateX( -${currentIndex * 100}%)` }} >
                    {items.map((item, index) => (
                        <div className="genCarousel_slide" key={item?._id || index} ref={(element) => { slideRefs.current[index] = element }}>
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
            {showButtons && (
                <button type="button" className="genCarousel_button genCarousel_button--next" onClick={handleNext} disabled={!loop && isLast}
                    aria-label={TEXT.NEXT_ELEMENT}>&#10095;</button>
            )}
            {showCounter && (
                <div className="genCarousel_counter">
                    {currentIndex + 1} / {items.length}
                </div>
            )}
        </div>
    );*/

    return (
        <div
            className={`genCarousel ${className}`}
            style={{
                width,
                height: viewportHeight
            }}
        >
            <div
                className="genCarousel_viewport"
                style={{
                    height: viewportHeight
                }}
            >
                <div
                    className="genCarousel_track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            className="genCarousel_slide"
                            key={item?._id || index}
                            ref={(element) => {
                                slideRefs.current[index] = element;
                            }}
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>

            {showButtons && (
                <>
                    <button
                        type="button"
                        className="genCarousel_button genCarousel_button--prev"
                        onClick={handlePrev}
                        disabled={!loop && isFirst}
                        aria-label={TEXT.PREV_ELEMENT}
                    >
                        &#10094;
                    </button>

                    <button
                        type="button"
                        className="genCarousel_button genCarousel_button--next"
                        onClick={handleNext}
                        disabled={!loop && isLast}
                        aria-label={TEXT.NEXT_ELEMENT}
                    >
                        &#10095;
                    </button>
                </>
            )}

            {showCounter && (
                <div className="genCarousel_counter">
                    {currentIndex + 1} / {items.length}
                </div>
            )}
        </div>
    );
};

export default CarouselGeneric;