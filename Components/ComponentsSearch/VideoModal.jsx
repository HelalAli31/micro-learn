// componentsSearch/VideoModal.js
import React from 'react';
import Link from 'next/link';
import { X, Clock, Eye, GraduationCap } from 'lucide-react';

export default function VideoModal({ selectedVideo, closeVideoModal }) {
  if (!selectedVideo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
          <button
            onClick={closeVideoModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{selectedVideo.title}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Under 6 minutes</span>
              <span className="mx-2">•</span>
              <Eye className="w-4 h-4 mr-2" />
              <span>YouTube</span>
            </div>
            <Link
              href="/register"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Sign Up to Save Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
