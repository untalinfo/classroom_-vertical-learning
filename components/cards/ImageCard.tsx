
import React, { useState } from 'react';
import type { ImageCard } from '../../types';

interface ImageCardProps {
  card: ImageCard;
}

const ImageCardComponent: React.FC<ImageCardProps> = ({ card }) => {
  const [isZoomed, setZoomed] = useState(false);

  return (
    <>
      <div 
        className="w-full h-full bg-black flex items-center justify-center cursor-zoom-in"
        onClick={(e) => { e.stopPropagation(); setZoomed(true); }}
      >
        <img src={card.url} alt={card.alt} className="w-full h-full object-cover" />
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
        >
          <img src={card.url} alt={card.alt} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
};

export default ImageCardComponent;
