"use client";

import React, { useState, useEffect } from "react";
import { Search, Play, FileText, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const ActivityOverview = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const quizDate = searchParams.get("quizDate");
    if (quizDate && user.quizHistory) {
      const matchedQuiz = user.quizHistory.find(
        (q) => q.dateTaken && new Date(q.dateTaken).toISOString() === quizDate
      );
      if (matchedQuiz) {
        setActiveModal("quiz");
        setActiveQuiz(matchedQuiz);
        setActiveQuestionIndex(0);
      }
    }
  }, [searchParams, user.quizHistory]);

  const handleBackToQuizList = () => {
    setActiveQuiz(null);
    setActiveQuestionIndex(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("quizDate");
    router.replace("/profile" + (params.size > 0 ? `?${params}` : ""));
  };

  const getIcon = (type) => {
    switch (type) {
      case "search":
        return <Search className="inline w-5 h-5 mr-2 text-purple-600" />;
      case "video":
        return <Play className="inline w-5 h-5 mr-2 text-blue-600" />;
      case "quiz":
        return <FileText className="inline w-5 h-5 mr-2 text-green-600" />;
      default:
        return null;
    }
  };
  
  // Group searchHistory items by category
const categorizedSearches = {};
(user.searchHistory || []).forEach((item) => {
  const category = item.category || "Other";
  if (!categorizedSearches[category]) {
    categorizedSearches[category] = [];
  }
  categorizedSearches[category].push(item);
});

// Group videoHistory items by category
const categorizedVideos = {};
(user.videoHistory || []).forEach((item) => {
  const category = item.category || "Other";
  if (!categorizedVideos[category]) {
    categorizedVideos[category] = [];
  }
  categorizedVideos[category].push(item);
});

const categorizedQuizzes = {};
(user.quizHistory || []).forEach((item) => {
  const category = item.category || "Other";
  if (!categorizedQuizzes[category]) {
    categorizedQuizzes[category] = [];
  }
  categorizedQuizzes[category].push(item);
});


  const renderList = (type) => {
  const items = user[`${type}History`] || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-700 w-[900px] max-h-[80vh] overflow-y-auto p-6 rounded-xl shadow-xl relative border border-gray-200 custom-scroll text-gray-800 dark:text-gray-100">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-400"
          onClick={() => {
            setActiveModal(null);
            setActiveQuestionIndex(0);
            setActiveQuiz(null);
            setActiveCategory(null)
            router.replace("/profile");
          }}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center">
          {getIcon(type)} {type} History
        </h2>

        {items.length > 0 ? (
          type === "quiz" && activeQuiz ? (
            // ✅ Quiz detail view
            <div>
              <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">
                📅 {new Date(activeQuiz.dateTaken).toLocaleString()}
              </div>
              <div className="text-green-700 dark:text-green-400 font-medium mb-3">
                ✅ Score: {activeQuiz.score} / {activeQuiz.totalQuestions}
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Q{activeQuestionIndex + 1}:{" "}
                  {activeQuiz.fullQuizContent[activeQuestionIndex].question}
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  {activeQuiz.fullQuizContent[activeQuestionIndex].options.map((opt, j) => (
                    <li
                      key={j}
                      className={
                        j === activeQuiz.fullQuizContent[activeQuestionIndex].correctIndex
                          ? "text-green-700 dark:text-green-400 font-semibold"
                          : j === activeQuiz.userAnswers[activeQuestionIndex]
                          ? "text-red-500"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                <div className="text-sm mt-2">
                  Your Answer:{" "}
                  <span
                    className={
                      activeQuiz.userAnswers[activeQuestionIndex] ===
                      activeQuiz.fullQuizContent[activeQuestionIndex].correctIndex
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-500"
                    }
                  >
                    {
                      activeQuiz.fullQuizContent[activeQuestionIndex].options[
                        activeQuiz.userAnswers[activeQuestionIndex]
                      ]
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setActiveQuestionIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={activeQuestionIndex === 0}
                    className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-1 rounded disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() =>
                      setActiveQuestionIndex((prev) =>
                        Math.min(prev + 1, activeQuiz.fullQuizContent.length - 1)
                      )
                    }
                    disabled={activeQuestionIndex === activeQuiz.fullQuizContent.length - 1}
                    className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-1 rounded disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>

                <button
                  onClick={handleBackToQuizList}
                  className="mt-4 text-sm text-blue-700 dark:text-blue-400 underline hover:text-blue-900"
                >
                  ← Back to all quizzes
                </button>
              </div>
            </div>
          ) : type === "search" ? (
            // ✅ Search history with category filters
            <>
              {Object.keys(categorizedSearches).length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2 justify-center">
                  {Object.keys(categorizedSearches).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-sm px-3 py-1 rounded-full border ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 text-blue-600 border-blue-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-sm px-3 py-1 rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  >
                    All
                  </button>
                </div>
              )}

              <ul className="list-disc list-inside space-y-2 pr-2">
                {(activeCategory
                  ? categorizedSearches[activeCategory] || []
                  : user.searchHistory || []
                )
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      🔍 <span className="text-blue-600">{item.value}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({new Date(item.timestamp).toLocaleString()})
                      </span>
                    </li>
                  ))}
              </ul>
            </>
          ) : type === "video" ? (
  // ✅ Video history with categories
  <>
    {Object.keys(categorizedVideos).length > 1 && (
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {Object.keys(categorizedVideos).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-3 py-1 rounded-full border ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 border-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory(null)}
          className="text-sm px-3 py-1 rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          All
        </button>
      </div>
    )}

    <ul className="list-disc list-inside space-y-2 pr-2">
      {(activeCategory
        ? categorizedVideos[activeCategory] || []
        : Object.values(categorizedVideos).flat()
      )
        .filter((v) => typeof v?.value === "string" && v.value.startsWith("http"))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((video, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
            <button
              onClick={() => setSelectedVideo(video.value)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              🎥 {video.title || "Video"}
            </button>
            <span className="ml-2 text-xs text-gray-500">
              ({new Date(video.timestamp).toLocaleString()})
            </span>
          </li>
        ))}
    </ul>
  </>

          ) :  (
            // ✅ Fallback (quiz list view)
           <>
    {Object.keys(categorizedQuizzes).length > 1 && (
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {Object.keys(categorizedQuizzes).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-3 py-1 rounded-full border ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 border-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory(null)}
          className="text-sm px-3 py-1 rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        >
          All
        </button>
      </div>
    )}

    <ul className="list-disc list-inside space-y-2 pr-2">
      {(activeCategory
        ? categorizedQuizzes[activeCategory] || []
        : Object.values(categorizedQuizzes).flat()
      )
        .sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken))
        .map((item, i) => (
          <li key={i} className="text-gray-700 dark:text-gray-300 mb-2">
            <span
              className="text-blue-700 dark:text-blue-400 underline hover:text-blue-900 cursor-pointer"
              onClick={() => {
                try {
                  const quizDate = new Date(item.dateTaken).toISOString();
                  setActiveQuiz(item);
                  setActiveQuestionIndex(0);
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("quizDate", quizDate);
                  router.replace("/profile?" + params.toString());
                } catch (e) {
                  console.warn("Invalid date in quiz entry", item.dateTaken);
                }
              }}
            >
              📘 View Quiz from {new Date(item.dateTaken).toLocaleString()}
            </span>
          </li>
        ))}
    </ul>
  </>
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data available.</p>
        )}
      </div>
    </div>
  );
};


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* Searches */}
        <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Search className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
            {user.searchHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Searches
          </p>
          <button
            onClick={() => setActiveModal("search")}
            className="text-sm px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            View Searches
          </button>
        </div>

        {/* Videos */}
        <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <Play className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            {user.videoHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Videos Watched
          </p>
          <button
            onClick={() => setActiveModal("video")}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            View Videos
          </button>
        </div>

        {/* Quizzes */}
        <div className="flex flex-col items-center bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <FileText className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            {user.quizHistory?.length || 0}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Quizzes Completed
          </p>
          <button
            onClick={() => setActiveModal("quiz")}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            View Quizzes
          </button>
        </div>
      </div>

      {activeModal && renderList(activeModal)}

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 relative w-full max-w-2xl shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-600"
              onClick={() => setSelectedVideo(null)}
            >
              <X />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={selectedVideo.replace("watch?v=", "embed/")}
                className="w-full h-96 rounded"
                title="Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityOverview;
