"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Clock, Eye, GraduationCap } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function VideoModal({ selectedVideo, closeVideoModal }) {
  if (!selectedVideo) return null;

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    const saveVideoHistory = async () => {
      if (selectedVideo && username) {
        try {
          await fetch("/api/add/videoHistory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              value: selectedVideo.id,
            }),
          });
        } catch (error) {
          console.error("Error saving video history:", error);
        }
      }
    };

    saveVideoHistory();
  }, [selectedVideo, username]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl w-full max-w-4xl shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
          <button
            onClick={closeVideoModal}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
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
          <p className="mb-6">{selectedVideo.title}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Under 6 minutes</span>
              <span className="mx-2">•</span>
              <Eye className="w-4 h-4 mr-2" />
              <span>YouTube</span>
              <span className="mx-2">•</span>
              <Eye className="w-4 h-4 mr-2" />
              <span>{Number(selectedVideo.views).toLocaleString()} views</span>
            </div>
            
            {username === "guest" && (
              <Link
                href="/signup"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Sign Up to Save Progress
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
