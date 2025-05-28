// src/app/search/page.js (or page.jsx)
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Import your new components - Ensure these paths are correct for your setup
// If componentsSearch is OUTSIDE src/:
import SearchHeader from '../../../Components/ComponentsSearch/SearchHeader.jsx';
import LoadingState from '../../../Components/ComponentsSearch/LoadingState.jsx';
import ResultsSection from '../../../Components/ComponentsSearch/ResultsSection.jsx';
import VideoModal from '../../../Components/ComponentsSearch/VideoModal.jsx';
import InitialState from '../../../Components/ComponentsSearch/InitialState.jsx';
import QuizButton from '../../../Components/ComponentsSearch/QuizButton.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  // Change explanation to store an object, not just a string
  const [explanation, setExplanation] = useState(null); // Initialize as null or an empty object
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  async function handleSearch(searchQuery) {
    const searchTerm = searchQuery || query;
    if (!searchTerm) return;

    setLoading(true);
    setHasSearched(true);
    setExplanation(null); // Reset explanation to null/empty object
    setQuiz([]);

    try {
      const videosRes = await fetch(
        `/api/videos?query=${encodeURIComponent(searchTerm)}`
      );
      const videosData = await videosRes.json();

      const explanationRes = await fetch(
        `/api/explanation?query=${encodeURIComponent(searchTerm)}`
      );
      const explanationData = await explanationRes.json(); // explanationData will be { explanation: "...", query: "..." }

      setVideos(
        (videosData.videos || []).map((v) => ({
          id: v.id,
          title: v.title,
          url: v.url,
        }))
      );

      // Store the entire explanationData object
      // This ensures 'explanation' state has both 'explanation' text and 'query' properties
      setExplanation({
        text: explanationData.explanation || '', // Assuming API returns 'explanation' field for text
        query: explanationData.query || searchTerm, // Assuming API returns 'query' field, or use searchTerm as fallback
      });
      setQuiz(explanationData.quiz || []);
    } catch (error) {
      console.error('Search error:', error);
      setExplanation(null); // Clear explanation on error
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  function openVideoModal(video) {
    setSelectedVideo(video);
  }

  function closeVideoModal() {
    setSelectedVideo(null);
  }

  const handleMakeQuiz = () => {
    if (quiz.length > 0) {
      try {
        localStorage.setItem('currentQuiz', JSON.stringify(quiz));
        router.push('/quiz');
      } catch (error) {
        console.error('Error storing quiz in localStorage:', error);
        alert('Could not save quiz. Please try again.');
      }
    } else {
      alert(
        'Please perform a search and generate an explanation first to make a quiz.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
      />

      {loading && <LoadingState />}

      {hasSearched && !loading && (
        <ResultsSection
          explanation={explanation} // Now 'explanation' is an object { text: "...", query: "..." }
          videos={videos}
          openVideoModal={openVideoModal}
          quiz={quiz}
          hasSearched={hasSearched}
          loading={loading}
          setQuery={setQuery}
          setHasSearched={setHasSearched}
          setVideos={setVideos}
          setExplanation={setExplanation}
          setQuiz={setQuiz}
        />
      )}

      {!hasSearched && !loading && <InitialState />}

      {selectedVideo && (
        <VideoModal
          selectedVideo={selectedVideo}
          closeVideoModal={closeVideoModal}
        />
      )}

      {quiz.length > 0 && <QuizButton handleMakeQuiz={handleMakeQuiz} />}
      {hasSearched && !loading && quiz.length === 0 && explanation && (
        <div className="text-center text-gray-500 mt-12 mb-10">
          No quiz could be generated for this topic.
        </div>
      )}
    </div>
  );
}
