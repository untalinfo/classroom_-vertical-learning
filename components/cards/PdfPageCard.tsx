import React from 'react';
import type { PdfPageCard } from '../../types';
import ImageCardComponent from './ImageCard';
import { CardType } from '../../types';

interface PdfPageCardProps {
  card: PdfPageCard;
}

const PdfPageCardComponent: React.FC<PdfPageCardProps> = ({ card }) => {
  return (
    <div className="relative w-full h-full">
        {/* FIX: Correctly create an ImageCard-compatible object.
            The original spread of the `card` prop resulted in a `type` of `CardType.PdfPage`,
            which is incompatible with `ImageCardComponent`. Overriding the `type` property
            to `CardType.Image` resolves the type error. */}
        <ImageCardComponent card={{ ...card, type: CardType.Image, alt: `PDF Page ${card.pageNumber}`}} />
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            Page {card.pageNumber}
        </div>
    </div>
  );
};

export default PdfPageCardComponent;
