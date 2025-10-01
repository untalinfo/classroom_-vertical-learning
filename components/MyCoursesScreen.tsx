import React from 'react';
import type { Course, Module } from '../types';

interface MyCoursesScreenProps {
  courses: Course[];
  onSelectModule: (course: Course, module: Module) => void;
}

const MyCoursesScreen: React.FC<MyCoursesScreenProps> = ({ courses, onSelectModule }) => {
  return (
    <div className="p-4 h-full overflow-y-auto bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Available Courses</h1>
      <div className="space-y-8">
        {courses.map(course => {
          const imageUrl = `https://picsum.photos/seed/${course.id}/800/400`;
          return (
            <div key={course.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
              <div className="relative">
                <img src={imageUrl} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                  <p className="text-gray-300 text-sm mt-1">{course.description}</p>
                </div>
              </div>

              <div className="p-4">
                {course.modules.length > 0 && <h3 className="text-md font-semibold text-gray-300 mb-3">Modules</h3>}
                <div className="space-y-2">
                  {course.modules.map(module => (
                    <div
                      key={module.id}
                      onClick={() => onSelectModule(course, module)}
                      className="bg-gray-700/50 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors flex justify-between items-center"
                    >
                      <h4 className="text-lg font-medium text-white">{module.title}</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCoursesScreen;