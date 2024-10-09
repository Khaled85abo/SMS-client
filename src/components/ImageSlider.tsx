import React from 'react';

type ImageSliderProps = {
    images: string[];
    selectedIndex: number;
    onImageChange: (index: number) => void;
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images, selectedIndex, onImageChange }) => {
    const goToPrevious = () => {
        const isFirstSlide = selectedIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : selectedIndex - 1;
        onImageChange(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = selectedIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : selectedIndex + 1;
        onImageChange(newIndex);
    };

    return (
        <div className="relative h-64 mb-4">
            <img src={`data:image/png;base64,${images[selectedIndex]}`} alt="Item" className="w-full h-full object-cover" />
            <button onClick={goToPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2">&lt;</button>
            <button onClick={goToNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2">&gt;</button>
        </div>
    );
};

export default ImageSlider;