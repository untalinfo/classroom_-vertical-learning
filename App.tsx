import React, { useState, useMemo, useCallback } from 'react';
import { useCourseData } from './hooks/useCourseData';
import { getDocument } from 'pdfjs-dist';
import type { Course, Module, Card, Note, Progress } from './types';
import CourseViewer from './components/CourseViewer';
import BottomNavBar from './components/BottomNavBar';
import MyCoursesScreen from './components/MyCoursesScreen';
import ProgressScreen from './components/ProgressScreen';
import NotesScreen from './components/NotesScreen';
import { BookOpenIcon } from './components/icons/Icons';

type Tab = 'home' | 'courses' | 'progress' | 'notes';

const App: React.FC = () => {
  const { courses, updateCardInCourse, expandPdfModule } = useCourseData();
  const [activeTab, setActiveTab] = useState<Tab>('courses');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  
  const allNotes = useMemo(() => {
    const notes: Note[] = [];
    courses.forEach(course => {
      course.modules.forEach(module => {
        module.cards.forEach(card => {
          if (card.note) {
            notes.push({
              cardId: card.id,
              note: card.note,
              courseTitle: course.title,
              moduleTitle: module.title,
            });
          }
        });
      });
    });
    return notes;
  }, [courses]);

  const allProgress = useMemo(() => {
    const progressData: Progress[] = [];
    courses.forEach(course => {
        const totalCards = course.modules.reduce((sum, module) => sum + module.cards.length, 0);
        // In a real app, viewed status would be tracked. Here we simulate it.
        const completedCards = Math.floor(Math.random() * totalCards);
        progressData.push({
            courseTitle: course.title,
            totalModules: course.modules.length,
            completionPercentage: totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0,
        });
    });
    return progressData;
  }, [courses]);

  const handleUpdateCard = useCallback((updatedCard: Card) => {
    if (activeCourse && activeModule) {
      updateCardInCourse(activeCourse.id, activeModule.id, updatedCard);
    }
  }, [activeCourse, activeModule, updateCardInCourse]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        if (!activeCourse || !activeModule) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
              <div className="w-16 h-16 mb-4">
                <BookOpenIcon />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vertical Learning</h2>
              <p>Please select a module from the 'Courses' tab to begin your learning journey.</p>
            </div>
          );
        }
        return <CourseViewer 
                  course={activeCourse} 
                  module={activeModule} 
                  onUpdateCard={handleUpdateCard}
                  onGoBack={() => {
                    setActiveCourse(null);
                    setActiveModule(null);
                    setActiveTab('courses');
                  }}
                />;
      case 'courses':
        return <MyCoursesScreen 
                 courses={courses} 
                 onSelectModule={async (course, module) => {
                   const pdfPages = module.cards.filter(c => c.type === ("PDF_PAGE" as any));
                   if (pdfPages.length > 0) {
                     const pdfUrl = (pdfPages[0] as any).url;
                      try {
                        const np = await expandPdfModule(course.id, module.id, pdfUrl, { maxPages: 1000 });
                        if (typeof np === 'number' && np > 0) {
                          // Read the persisted courses from localStorage to get the expanded module (including appended exams)
                          try {
                            const raw = localStorage.getItem('vl_courses_v1');
                            if (raw) {
                              const parsed = JSON.parse(raw) as any[];
                              const updatedCourse = parsed.find((c: any) => c.id === course.id) || course;
                              const updatedModule = (updatedCourse.modules || []).find((m: any) => m.id === module.id) || null;
                              if (updatedModule) {
                                setActiveCourse(updatedCourse as any);
                                setActiveModule(updatedModule as any);
                                setActiveTab('home');
                                return;
                              }
                            }
                          } catch (e) {
                            // fallback to in-memory expanded module if localStorage read fails
                            const expandedModule = {
                              ...module,
                              cards: Array.from({ length: np }).map((_, i) => ({
                                id: `${module.id}-pdf-${i+1}`,
                                type: ("PDF_PAGE" as any),
                                url: pdfUrl,
                                pageNumber: i+1,
                                bookmarked: false,
                              }))
                            } as any;
                            setActiveCourse(course);
                            setActiveModule(expandedModule as any);
                            setActiveTab('home');
                            return;
                          }
                        }
                      } catch (e) {
                       // fallback to original
                     }
                   }
                   setActiveCourse(course);
                   setActiveModule(module);
                   setActiveTab('home');
                 }}
               />;
      case 'progress':
        return <ProgressScreen progress={allProgress} />;
      case 'notes':
        return <NotesScreen notes={allNotes} />;
      default:
        return null;
    }
  };

  // Determinar si estamos visualizando un curso
  const isViewingCourse = activeTab === 'home' && activeCourse && activeModule;

  // Manejar el cambio de pestaña
  const handleTabChange = (tab: Tab) => {
    if (tab === 'home' && (!activeCourse || !activeModule)) {
      // Si no hay curso activo, ir a courses
      setActiveTab('courses');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col antialiased text-white overflow-hidden max-w-md mx-auto shadow-2xl">
      <main className="flex-1 relative min-h-0">
        {renderContent()}
      </main>
      {!isViewingCourse && <BottomNavBar activeTab={activeTab} setActiveTab={handleTabChange} />}
    </div>
  );
};

export default App;