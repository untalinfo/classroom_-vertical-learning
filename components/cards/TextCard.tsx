
import React from 'react';
import type { TextCard } from '../../types';

interface TextCardProps {
  card: TextCard;
}

const TextCardComponent: React.FC<TextCardProps> = ({ card }) => {
  return (
    <div className="w-full h-full bg-gray-900 p-8 flex justify-center items-center">
      <div className="text-white text-xl md:text-2xl leading-relaxed whitespace-pre-line overflow-y-auto max-h-full">
        {card.content}
      </div>
    </div>
  );
};

export default TextCardComponent;
