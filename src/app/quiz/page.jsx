'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
    if (validationMessage) {
      setValidationMessage(null);
    }
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();

    if (!quiz) return;

    const allAnswered = selectedAnswers.every((answer) => answer !== -1);

    if (allAnswered) {
      setValidationMessage(null);
      setShowResults(true);
    } else {
      setValidationMessage('Please choose an answer');
      setShowResults(false);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 mb-4">
          <Image
            src="/microlearn-logo.png"
            alt="MicroLearn Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Error Loading Quiz
        </h1>
        <p className="text-lg text-gray-700 mb-8">{error}</p>
        <Link
          href="/search"
          className="px-6 py-3 bg-[#293292] text-white rounded-xl font-semibold hover:bg-[#1a1f5d] transition duration-300"
        >
          Go to Search Page
        </Link>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 mb-4">
          <Image
            src="/microlearn-logo.png"
            alt="MicroLearn Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          No Quiz Available
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          It looks like you haven't generated a quiz yet. Please go back to the
          search page.
        </p>
        <Link
          href="/search"
          className="px-6 py-3 bg-[#293292] text-white rounded-xl font-semibold hover:bg-[#1a1f5d] transition duration-300"
        >
          Go to Search Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <nav className="bg-[#293292] text-white shadow-md sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <Image
                src="/microlearn-logo.png"
                alt="MicroLearn Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <span className="text-2xl font-bold">MicroLearn</span>
          </Link>
          <Link
            href="/search"
            className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-[#293292] transition"
          >
            Back to Search
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Your MicroLearn Quiz
        </h1>

        <form
          onSubmit={handleSubmitQuiz}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {quiz.map((quizItem, index) => (
            <div
              key={index}
              className="mb-8 p-6 border border-gray-200 rounded-lg"
            >
              <p className="text-xl font-semibold text-gray-800 mb-4">
                {index + 1}. {quizItem.question}
              </p>
              <ul className="list-none pl-0">
                {quizItem.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="mb-3">
                    <label
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors duration-200
                                  ${
                                    showResults &&
                                    optionIndex === quizItem.correctIndex
                                      ? 'bg-green-100 border border-green-500'
                                      : ''
                                  }
                                  ${
                                    showResults &&
                                    selectedAnswers[index] === optionIndex &&
                                    optionIndex !== quizItem.correctIndex
                                      ? 'bg-red-100 border border-red-500'
                                      : ''
                                  }
                                  ${
                                    selectedAnswers[index] === optionIndex &&
                                    !showResults
                                      ? 'bg-blue-50 border border-blue-200'
                                      : 'hover:bg-gray-50'
                                  }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                        checked={selectedAnswers[index] === optionIndex}
                        onChange={() => handleOptionChange(index, optionIndex)}
                        className="mr-3 h-4 w-4 text-[#293292] focus:ring-[#293292]"
                        disabled={showResults}
                      />
                      <span className="text-lg text-gray-700">{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {showResults && selectedAnswers[index] !== -1 && (
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">Correct Answer:</span>{' '}
                  {quizItem.options[quizItem.correctIndex]}
                </p>
              )}
            </div>
          ))}

          {validationMessage && (
            <p className="text-red-600 text-center text-lg mb-4">
              {validationMessage}
            </p>
          )}

          {!showResults ? (
            <button
              type="submit"
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold text-xl shadow hover:bg-orange-600 transition duration-300 mt-8"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Score: {calculateScore()} / {quiz.length}
              </h2>
              <button
                onClick={() => {
                  setShowResults(false);
                  setSelectedAnswers(new Array(quiz.length).fill(-1));
                  setValidationMessage(null);
                }}
                className="inline-block py-3 px-6 bg-[#293292] text-white rounded-xl font-semibold hover:bg-[#1a1f5d] transition duration-300"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
