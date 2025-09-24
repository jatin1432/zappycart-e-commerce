import React, { useState } from "react";

const ProductImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Product ${currentIndex}`}
        className="w-full h-80 object-contain border rounded"
      />
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full"
      >
        ◀
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full"
      >
        ▶
      </button>

      {/* Thumbnail dots */}
      <div className="flex justify-center mt-2 space-x-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === idx ? "bg-red-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
