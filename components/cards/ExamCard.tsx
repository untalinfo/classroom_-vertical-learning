
import React, { useState, useEffect } from 'react';
import type { ExamCard } from '../../types';
import { ExamType } from '../../types';

interface ExamCardProps {
  card: ExamCard;
  onAnswer: (answer: string | boolean) => void;
}

const ExamCardComponent: React.FC<ExamCardProps> = ({ card, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | undefined>(card.userAnswer);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setSelectedAnswer(card.userAnswer);
    setFeedback('');
    if (card.userAnswer !== undefined) {
      setFeedback(card.userAnswer === card.correctAnswer ? 'Correct!' : 'Incorrect. Try again!');
    }
  }, [card]);

  const handleAnswer = (answer: string | boolean) => {
    if (selectedAnswer !== undefined) return; // Prevent changing answer
    setSelectedAnswer(answer);
    onAnswer(answer);
    setFeedback(answer === card.correctAnswer ? 'Correct!' : 'Incorrect.');
  };

  const getButtonClass = (option: string | boolean) => {
    if (selectedAnswer === undefined) {
      return 'bg-gray-700 hover:bg-gray-600';
    }
    if (option === card.correctAnswer) {
      return 'bg-green-600';
    }
    if (option === selectedAnswer && option !== card.correctAnswer) {
      return 'bg-red-600';
    }
    return 'bg-gray-800 text-gray-500 cursor-not-allowed';
  };

  return (
    <div className="w-full h-full bg-gray-900 p-8 flex flex-col justify-center items-center text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">{card.question}</h2>
      
      <div className="w-full max-w-sm space-y-4">
        {card.examType === ExamType.MultipleChoice && card.options?.map(option => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== undefined}
            className={`w-full text-left p-4 rounded-lg text-lg transition-colors duration-200 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}

        {card.examType === ExamType.TrueFalse && (
          <>
            <button
              onClick={() => handleAnswer(true)}
              disabled={selectedAnswer !== undefined}
              className={`w-full p-4 rounded-lg text-lg transition-colors duration-200 ${getButtonClass(true)}`}
            >
              True
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={selectedAnswer !== undefined}
              className={`w-full p-4 rounded-lg text-lg transition-colors duration-200 ${getButtonClass(false)}`}
            >
              False
            </button>
          </>
        )}
      </div>

      {feedback && (
        <p className={`mt-8 text-xl font-bold ${feedback === 'Correct!' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </p>
      )}
    </div>
  );
};

export default ExamCardComponent;
