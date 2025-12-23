'use client';
import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const HotelGallery = ({ images, hotelName }) => {
  const [index, setIndex] = useState(-1);

  // Format images for the lightbox
  const slides = images?.map((src) => ({ src }));

  return (
    <div className="flex-1 space-y-4">
      {/* Main Image */}
      <div 
        className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gray-100 relative cursor-zoom-in"
        onClick={() => setIndex(0)}
      >
        <Image 
          src={images?.[0] || "/placeholder.jpg"} 
          alt={hotelName} 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-700" 
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {images?.slice(1, 4).map((img, i) => (
          <div 
            key={i} 
            className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative cursor-pointer group"
            onClick={() => setIndex(i + 1)} // i+1 because we sliced starting from index 1
          >
            <Image 
              src={img} 
              alt="Gallery" 
              fill 
              className="object-cover opacity-80 group-hover:opacity-100 transition-all" 
            />
            
            {/* Overlay for the 3rd thumbnail if more images exist */}
            {i === 2 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <span className="text-xl font-bold">+{images.length - 4}</span>
                <span className="text-xs uppercase tracking-widest">Photos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* The Lightbox Modal */}
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
        }}
      />
    </div>
  );
};

export default HotelGallery;