
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Course, Module, Card, TextCard, VideoCard, ImageCard, PdfPageCard, ExamCard } from '../types';
import { CardType } from '../types';

import TextCardComponent from './cards/TextCard';
import VideoCardComponent from './cards/VideoCard';
import ImageCardComponent from './cards/ImageCard';
import PdfPageCardComponent from './cards/PdfPageCard';
import ExamCardComponent from './cards/ExamCard';
import ProgressBar from './ProgressBar';
import { BookmarkIcon, PencilIcon, XMarkIcon, ChevronLeftIcon, ChevronDownIcon } from './icons/Icons';

interface CourseViewerProps {
  course: Course;
  module: Module;
  onUpdateCard: (card: Card) => void;
  onGoBack: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, module, onUpdateCard, onGoBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNoteEditorOpen, setNoteEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const activeCard = module.cards[activeIndex];

  // Helper to go to a specific index safely
  const goTo = useCallback((index: number) => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current as any;
    const bounded = Math.max(0, Math.min(index, module.cards.length - 1));
    if (typeof swiper.slideTo === 'function') {
      // slideTo expects index and optional speed
      swiper.slideTo(bounded, 300);
    }
  }, [module.cards.length]);

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleBookmarkToggle = () => {
    const updatedCard = { ...activeCard, bookmarked: !activeCard.bookmarked };
    onUpdateCard(updatedCard);
  };

  const openNoteEditor = () => {
    setCurrentNote(activeCard.note || '');
    setNoteEditorOpen(true);
  };

  const closeNoteEditor = () => {
    setNoteEditorOpen(false);
  };

  const saveNote = () => {
    const updatedCard = { ...activeCard, note: currentNote };
    onUpdateCard(updatedCard);
    closeNoteEditor();
  };

  const renderCard = (card: Card, isActive: boolean, isNearby: boolean) => {
    switch (card.type) {
      case CardType.Text:
        return <TextCardComponent card={card as TextCard} />;
      case CardType.Video:
        return <VideoCardComponent card={card as VideoCard} isActive={isActive} />;
      case CardType.Image:
        return <ImageCardComponent card={card as ImageCard} />;
      case CardType.PdfPage:
        return <PdfPageCardComponent card={card as PdfPageCard} isActive={isActive} isNearby={isNearby} />;
      case CardType.Exam:
        return <ExamCardComponent card={card as ExamCard} onAnswer={(userAnswer) => onUpdateCard({...card, userAnswer})} />;
      default:
        return null;
    }
  };

  // Pointer / click navigation: top half => previous, bottom half => next
  const handlePointerUp = (e: React.PointerEvent) => {
    // Ignore touch pointer events — mobile should rely on swipe
    // PointerEvent.pointerType may be 'touch', 'mouse', or 'pen'
    if ((e as any).pointerType === 'touch') return;
    // Get bounding rect to determine click position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isTop = y < rect.height / 2;
    if (isTop) {
      goTo(activeIndex - 1);
    } else {
      goTo(activeIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' ', 'Spacebar'].includes(ev.key)) return;
      if (ev.key === 'ArrowUp' || ev.key === 'PageUp') {
        ev.preventDefault();
        goTo(activeIndex - 1);
      } else if (ev.key === 'ArrowDown' || ev.key === 'PageDown' || ev.key === ' ' || ev.key === 'Spacebar') {
        ev.preventDefault();
        goTo(activeIndex + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, goTo]);

  // Detect touch devices: prefer feature detection
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && (
      ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );
    setIsTouchDevice(Boolean(isTouch));
  }, []);

  return (
    <div className="h-full w-full relative bg-black">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <button onClick={onGoBack} className="text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeftIcon />
          </button>
          <div className="flex-1 overflow-hidden">
             <h1 className="text-lg font-bold truncate">{course.title}</h1>
             <p className="text-sm text-gray-300 truncate">{module.title}</p>
          </div>
        </div>
        <ProgressBar current={activeIndex + 1} total={module.cards.length} />
      </div>

      <Swiper
        direction="vertical"
        className="w-full h-full"
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        autoHeight={false}
        style={{ height: '100%' }}
      >
        {module.cards.map((card, index) => {
          const isActive = index === activeIndex;
          const isNearby = Math.abs(index - activeIndex) <= 1; // prefetch neighbors
          return (
            <SwiperSlide key={card.id}>
              <div
                className="w-full h-full flex items-center justify-center"
                {...(!isTouchDevice ? { onPointerUp: handlePointerUp } : {})}
                style={{ height: '100%' }}
              >
                {/* renderCard will accept isActive boolean */}
                {renderCard(card, isActive, isNearby)}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Side Action Bar */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-6">
        <button onClick={handleBookmarkToggle} className="text-white p-2 rounded-full bg-black/40 backdrop-blur-sm">
           <BookmarkIcon filled={activeCard?.bookmarked} />
        </button>
        <button onClick={openNoteEditor} className="text-white p-2 rounded-full bg-black/40 backdrop-blur-sm">
           <PencilIcon filled={!!activeCard?.note} />
        </button>
      </div>

      {/* Next Button - Bottom Right */}
      {activeIndex < module.cards.length - 1 && (
        <div className="absolute bottom-4 right-4 z-10">
          <button 
            onClick={() => goTo(activeIndex + 1)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors duration-200 shadow-lg"
          >
            <span className="text-sm font-medium">Siguiente</span>
            <ChevronDownIcon />
          </button>
        </div>
      )}

      {/* Note Editor Modal */}
      {isNoteEditorOpen && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Personal Note</h2>
                <button onClick={closeNoteEditor}><XMarkIcon /></button>
            </div>
            <textarea
              className="flex-1 w-full bg-gray-800/50 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your thoughts here..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
            <button onClick={saveNote} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Save Note
            </button>
        </div>
      )}
    </div>
  );
};

export default CourseViewer;