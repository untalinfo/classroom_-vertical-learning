
import React from 'react';
import type { Note } from '../types';

interface NotesScreenProps {
  notes: Note[];
}

const NotesScreen: React.FC<NotesScreenProps> = ({ notes }) => {
  return (
    <div className="p-4 h-full overflow-y-auto bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">My Notes</h1>
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.cardId} className="bg-gray-800 rounded-lg p-4">
              <p className="text-white mb-2">"{note.note}"</p>
              <p className="text-xs text-gray-400">
                From: <span className="font-semibold text-gray-300">{note.courseTitle}</span> / {note.moduleTitle}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p>You haven't taken any notes yet.</p>
          <p className="text-sm">Use the pencil icon on a card to add a note.</p>
        </div>
      )}
    </div>
  );
};

export default NotesScreen;
