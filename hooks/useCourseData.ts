import { useState, useCallback } from 'react';
import type { Course, Card, TextCard } from '../types';
import { CardType, ExamType } from '../types';
import { getDocument } from 'pdfjs-dist';

const longTextContent = `Welcome to The Art of Storytelling. This course will guide you through the fundamental principles of crafting compelling narratives. We'll explore character development, plot structure, and the power of emotional resonance.

Our journey begins with the basics. What makes a story memorable? How do you hook a reader from the very first sentence? We'll analyze classic and contemporary examples to understand the techniques that master storytellers use to captivate their audiences.

Next, we dive into character arcs. A great story is often about transformation. We will learn how to create multi-dimensional characters that readers can connect with, root for, and remember long after they've finished the story.

Then, we'll dissect plot. From the inciting incident to the climax and resolution, every part of a story's structure serves a purpose. We'll practice outlining and structuring our own stories to ensure a satisfying and coherent narrative flow. This includes understanding concepts like rising action, falling action, and the importance of pacing.

Finally, we'll touch on the nuances of dialogue and setting. Effective dialogue can reveal character and advance the plot simultaneously, while a well-described setting can immerse the reader in your world. By the end of this module, you'll have a toolkit of techniques to elevate your own storytelling.

Are you ready to begin? Let's turn the page to the first chapter of your storytelling adventure.`;

const splitTextIntoCards = (text: string, idPrefix: string): TextCard[] => {
  const paragraphs = text.split('\n\n');
  const cards: TextCard[] = [];
  let cardContent = '';
  let paragraphCount = 0;

  paragraphs.forEach((p, index) => {
    cardContent += p + '\n\n';
    paragraphCount++;

    if (paragraphCount >= 2 || index === paragraphs.length - 1) {
      cards.push({
        id: `${idPrefix}-${cards.length + 1}`,
        type: CardType.Text,
        content: cardContent.trim(),
        bookmarked: false,
      });
      cardContent = '';
      paragraphCount = 0;
    }
  });
  return cards;
};

const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'The Art of Storytelling',
    description: 'Learn to craft compelling narratives.',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Narrative',
        cards: [
          ...splitTextIntoCards(longTextContent, 'c1-m1-t'),
          {
            id: 'c1-m1-v1',
            type: CardType.Video,
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            bookmarked: false,
          },
          {
            id: 'c1-m1-i1',
            type: CardType.Image,
            url: 'https://picsum.photos/seed/story/1080/1920',
            alt: 'A dramatic landscape representing a story setting',
            bookmarked: false,
          },
          {
            id: 'c1-m1-p1',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/pdf1/1080/1920',
            pageNumber: 1,
            bookmarked: false,
          },
          {
            id: 'c1-m1-p2',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/pdf2/1080/1920',
            pageNumber: 2,
            bookmarked: false,
          },
          {
            id: 'c1-m1-e1',
            type: CardType.Exam,
            examType: ExamType.MultipleChoice,
            question: 'What is the most crucial element of a compelling story?',
            options: ['Setting', 'Plot', 'Character', 'Dialogue'],
            correctAnswer: 'Character',
            bookmarked: false,
          },
          {
            id: 'c1-m1-e2',
            type: CardType.Exam,
            examType: ExamType.TrueFalse,
            question: 'True or False: The climax is the final part of a story.',
            correctAnswer: false,
            bookmarked: false,
          },
        ],
      },
      {
        id: 'module-1-2',
        title: 'Sample Story (PDF)',
        cards: [
          {
            id: 'c1-m2-p1',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/storypdf1/1080/1920',
            pageNumber: 1,
            bookmarked: false,
          },
          {
            id: 'c1-m2-p2',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/storypdf2/1080/1920',
            pageNumber: 2,
            bookmarked: false,
          },
          {
            id: 'c1-m2-p3',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/storypdf3/1080/1920',
            pageNumber: 3,
            bookmarked: false,
          },
          {
            id: 'c1-m2-p4',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/storypdf4/1080/1920',
            pageNumber: 4,
            bookmarked: false,
          },
          {
            id: 'c1-m2-p5',
            type: CardType.PdfPage,
            url: 'https://picsum.photos/seed/storypdf5/1080/1920',
            pageNumber: 5,
            bookmarked: false,
          },
        ],
      }
    ],
  },
  {
    id: 'course-2',
    title: 'Digital Marketing 101',
    description: 'Your first step into the world of online marketing.',
    modules: [
      {
        id: 'module-2-1',
        title: 'Understanding SEO',
        cards: [
          {
            id: 'c2-m1-i1',
            type: CardType.Image,
            url: 'https://picsum.photos/seed/marketing/1080/1920',
            alt: 'Digital marketing concepts on a screen',
            bookmarked: false,
          },
          {
            id: 'c2-m1-t1',
            type: CardType.Text,
            content: 'Search Engine Optimization (SEO) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines.',
            bookmarked: false,
          }
        ]
      }
    ]
  }
];

// Add a sample course backed by the local PDF in public/assets
MOCK_COURSES.push({
  id: 'course-3',
  title: 'React Práctico (PDF)',
  description: 'Curso basado en el PDF react-practico.pdf',
  modules: [
    {
      id: 'module-3-1',
      title: 'React Práctico (PDF) - Pages',
      cards: [
        // We add a few initial page cards; the viewer will show correct total when the PDF is loaded
        { id: 'rpdf-p1', type: CardType.PdfPage, url: '/assets/react-practico.pdf', pageNumber: 1, bookmarked: false },
        { id: 'rpdf-p2', type: CardType.PdfPage, url: '/assets/react-practico.pdf', pageNumber: 2, bookmarked: false },
        { id: 'rpdf-p3', type: CardType.PdfPage, url: '/assets/react-practico.pdf', pageNumber: 3, bookmarked: false },
        { id: 'rpdf-p4', type: CardType.PdfPage, url: '/assets/react-practico.pdf', pageNumber: 4, bookmarked: false },
        { id: 'rpdf-p5', type: CardType.PdfPage, url: '/assets/react-practico.pdf', pageNumber: 5, bookmarked: false },
      ],
    },
  ],
});

export const useCourseData = () => {
  const STORAGE_KEY = 'vl_courses_v1';
  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return MOCK_COURSES;
      const parsed = JSON.parse(raw) as Course[];
      return parsed;
    } catch (e) {
      return MOCK_COURSES;
    }
  };

  const [courses, setCourses] = useState<Course[]>(() => loadFromStorage());

  const saveToStorage = (next: Course[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore storage errors
    }
  };

  const updateCardInCourse = useCallback((courseId: string, moduleId: string, updatedCard: Card) => {
    setCourses(prevCourses => {
      const next = prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id === moduleId) {
                return {
                  ...module,
                  cards: module.cards.map(card =>
                    card.id === updatedCard.id ? updatedCard : card
                  ),
                };
              }
              return module;
            }),
          };
        }
        return course;
      });
      saveToStorage(next);
      return next;
    });
  }, []);

  const expandPdfModule = useCallback(async (courseId: string, moduleId: string, pdfUrl: string, options?: { maxPages?: number }) => {
    const MAX_PAGES = options?.maxPages ?? 1000; // safety default
    try {
      const loadingTask = getDocument(pdfUrl);
      const doc = await loadingTask.promise;
      const np = doc.numPages || 0;
      if (np <= 0) throw new Error('PDF has no pages');
      if (np > MAX_PAGES) throw new Error(`PDF too large (${np} pages)`);

      setCourses(prevCourses => {
        const next = prevCourses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id !== moduleId) return module;
              const expandedCards: Card[] = Array.from({ length: np }).map((_, i) => ({
                id: `${module.id}-pdf-${i + 1}`,
                type: CardType.PdfPage,
                url: pdfUrl,
                pageNumber: i + 1,
                bookmarked: false,
              })) as any;

              // Append a small quiz with two questions at the end of the PDF module
              const examCards: Card[] = [
                {
                  id: `${module.id}-exam-1`,
                  type: CardType.Exam,
                  examType: ExamType.MultipleChoice,
                  question: '¿Cuál es el objetivo principal del documento revisado?',
                  options: ['Enseñar React desde cero', 'Describir conceptos de marketing', 'Explicar patrones de diseño'],
                  correctAnswer: 'Enseñar React desde cero',
                  bookmarked: false,
                } as any,
                {
                  id: `${module.id}-exam-2`,
                  type: CardType.Exam,
                  examType: ExamType.TrueFalse,
                  question: 'El PDF cubre temas avanzados de desarrollo web. (Verdadero/Falso)',
                  correctAnswer: true,
                  bookmarked: false,
                } as any,
              ];
              // Welcome card shown as first slide
              const welcomeCard: Card = {
                id: `${module.id}-welcome`,
                type: CardType.Text,
                content: 'Bienvenido al curso de React desde cero\n\nDesliza para avanzar',
                bookmarked: false,
              } as any;

              const finalCards = [welcomeCard, ...expandedCards, ...examCards];
              return {
                ...module,
                cards: finalCards,
              };
            }),
          };
        });
        saveToStorage(next);
        return next;
      });
      return np;
    } catch (err) {
      throw err;
    }
  }, []);

  return { courses, updateCardInCourse, expandPdfModule };
};