'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';

// Import your new components
import LoadingState from '../../../Components/ComponentsQuiz/LoadingState';
import ErrorState from '../../../Components/ComponentsQuiz/ErrorState';
import NoQuizAvailable from '../../../Components/ComponentsQuiz/NoQuizAvailable';
import QuizForm from '../../../Components/ComponentsQuiz/QuizForm';

export default function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    try {
      const storedQuiz = localStorage.getItem('currentQuiz');
      if (storedQuiz) {
        const parsedQuiz = JSON.parse(storedQuiz);
        setQuiz(parsedQuiz);
        setSelectedAnswers(new Array(parsedQuiz.length).fill(-1));
      } else {
        setError(
          'No quiz found. Please go back to the search page and generate one.'
        );
      }
    } catch (e) {
      console.error('Failed to parse quiz from localStorage:', e);
      setError('Failed to load quiz data. It might be corrupted.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize these functions to prevent unnecessary re-renders in child components
  const handleOptionChange = useCallback(
    (questionIndex, optionIndex) => {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newSelectedAnswers);
      if (validationMessage) {
        setValidationMessage(null);
      }
    },
    [selectedAnswers, validationMessage]
  );

  const handleSubmitQuiz = useCallback(
    e => {
      e.preventDefault();

      if (!quiz) return;

      const allAnswered = selectedAnswers.every(answer => answer !== -1);

      if (allAnswered) {
        setValidationMessage(null);
        setShowResults(true);
      } else {
        setValidationMessage('Please choose an answer for all questions.'); // More specific message
        setShowResults(false);
      }
    },
    [quiz, selectedAnswers]
  );

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [quiz, selectedAnswers]);

  // Render logic based on state
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!quiz || quiz.length === 0) {
    return <NoQuizAvailable />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Your MicroLearn Quiz
        </h1>

        <QuizForm
          quiz={quiz}
          selectedAnswers={selectedAnswers}
          handleOptionChange={handleOptionChange}
          handleSubmitQuiz={handleSubmitQuiz}
          showResults={showResults}
          validationMessage={validationMessage}
          calculateScore={calculateScore}
          // Note: The Retake Quiz button logic is simplified within QuizForm for now.
          // For a more robust solution, you might pass a dedicated `onRetake` prop.
        />
      </div>
    </div>
  );
}
