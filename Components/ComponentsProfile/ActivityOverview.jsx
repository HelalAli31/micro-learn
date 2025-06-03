'use client';

import React, { useState } from 'react';
import { Search, Play, FileText, X } from 'lucide-react';

const ActivityOverview = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null); // 'search', 'video', 'quiz'

  const getIcon = (type) => {
    switch (type) {
      case 'search':
        return <Search className="inline w-5 h-5 mr-2 text-purple-600" />;
      case 'video':
        return <Play className="inline w-5 h-5 mr-2 text-blue-600" />;
      case 'quiz':
        return <FileText className="inline w-5 h-5 mr-2 text-green-600" />;
      default:
        return null;
    }
  };

  const renderList = (type) => {
    const items = user[`${type}History`] || [];

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md max-h-[70vh] overflow-y-auto p-6 rounded-xl shadow-xl relative border border-gray-200 custom-scroll">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={() => setActiveModal(null)}
          >
            <X />
          </button>
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
            {getIcon(type)} {type} History
          </h2>
          {items.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 pr-2">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* Searches */}
        <div className="flex flex-col items-center bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Search className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-lg font-semibold text-purple-700">
            {user.searchHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">Searches</p>
          <button
            onClick={() => setActiveModal('search')}
            className="text-sm px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            View Searches
          </button>
        </div>

        {/* Videos */}
        <div className="flex flex-col items-center bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Play className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-lg font-semibold text-blue-700">
            {user.videoHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">Videos Watched</p>
          <button
            onClick={() => setActiveModal('video')}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            View Videos
          </button>
        </div>

        {/* Quizzes */}
        <div className="flex flex-col items-center bg-green-50 border border-green-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <FileText className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-lg font-semibold text-green-700">
            {user.quizHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 mb-2">Quizzes Completed</p>
          <button
            onClick={() => setActiveModal('quiz')}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            View Quizzes
          </button>
        </div>
      </div>

      {/* Modal Renderer */}
      {activeModal && renderList(activeModal)}
    </>
  );
};

export default ActivityOverview;
