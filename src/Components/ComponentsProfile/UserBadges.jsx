"use client";

import React from "react";

function getUserBadges(quizHistory) {
  const badges = [];

  if (!quizHistory || quizHistory.length === 0) return badges;

  const totalQuizzes = quizHistory.length;
  const totalScore = quizHistory.reduce((sum, q) => sum + (q.score || 0), 0);
  const totalQuestions = quizHistory.reduce(
    (sum, q) => sum + (q.totalQuestions || 0),
    0
  );
  const avgScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

  if (totalQuizzes >= 1) badges.push({ emoji: "🐣", label: "Beginner" });
  if (totalQuizzes >= 3 && avgScore >= 0.5)
    badges.push({ emoji: "📘", label: "Learner" });
  if (totalQuizzes >= 5 && avgScore >= 0.75)
    badges.push({ emoji: "🧠", label: "Brainiac" });
  if (quizHistory.some((q) => q.score === q.totalQuestions)) {
    badges.push({ emoji: "🔥", label: "Perfect Score" });
  }

  // Optional: detect 3-day streak
  const sortedDates = quizHistory
    .map((q) => new Date(q.dateTaken).toDateString())
    .filter(Boolean)
    .sort();

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    if (curr - prev === 86400000) {
      streak++;
    } else {
      streak = 1;
    }

    if (streak >= 3) {
      badges.push({ emoji: "📈", label: "Consistent" });
      break;
    }
  }

  return badges;
}

const UserBadges = ({ user }) => {
  const badges = getUserBadges(user?.quizHistory);

  if (!badges.length) return null;

  return (
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        🏅 Achievements
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {badges.map((b, i) => (
          <span
            key={i}
            className="flex items-center bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
          >
            {b.emoji} {b.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;
// BADGES Table
// /👣 Beginner	Completed 1+ quizzes
// 📚 Learner	Completed 3+ quizzes with average score ≥ 50%
// 🧠 Brainiac	Completed 5+ quizzes with avg score ≥ 75% and all answered
// 🔥 Perfect Score	Has at least one quiz with a perfect score (100%)
// 📈 Consistent	Completed quizzes 3 days in a row
