"use client";

import React from "react";

function getUserBadges(quizHistory) {
  const badges = [];
  const badgeLevels = [
    {
      label: "Beginner",
      emoji: "🐣",
      requiredQuizzes: 1,
      requiredScore: 0,
    },
    {
      label: "Learner",
      emoji: "📘",
      requiredQuizzes: 3,
      requiredScore: 0.5,
    },
    {
      label: "Brainiac",
      emoji: "🧠",
      requiredQuizzes: 5,
      requiredScore: 0.75,
    },
  ];

  let badgeProgress = null;

  if (!quizHistory || quizHistory.length === 0)
    return { badges, badgeProgress };

  const totalQuizzes = quizHistory.length;
  const totalScore = quizHistory.reduce((sum, q) => sum + (q.score || 0), 0);
  const totalQuestions = quizHistory.reduce(
    (sum, q) => sum + (q.totalQuestions || 0),
    0
  );
  const avgScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

  for (let i = 0; i < badgeLevels.length; i++) {
    const b = badgeLevels[i];
    const earned =
      totalQuizzes >= b.requiredQuizzes && avgScore >= b.requiredScore;

    if (earned) {
      badges.push({ emoji: b.emoji, label: b.label });
    } else if (!badgeProgress) {
      // First unearned badge = next level
      const quizProgress = Math.min(1, totalQuizzes / b.requiredQuizzes);
      const scoreProgress =
        b.requiredScore === 0 ? 1 : Math.min(1, avgScore / b.requiredScore);
      const progress = Math.floor(quizProgress * scoreProgress * 100);

      badgeProgress = {
        emoji: b.emoji,
        label: b.label,
        progress,
      };
    }
  }

  // 🔥 Perfect Score
  if (quizHistory.some((q) => q.score === q.totalQuestions)) {
    badges.push({ emoji: "🔥", label: "Perfect Score" });
  }

  // 📈 3-day Streak
  const sortedDates = quizHistory
    .map((q) => new Date(q.dateTaken).toDateString())
    .filter(Boolean)
    .sort();

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    if (curr - prev === 86400000) streak++;
    else streak = 1;

    if (streak >= 3) {
      badges.push({ emoji: "📈", label: "Consistent" });
      break;
    }
  }

  return { badges, badgeProgress };
}

const UserBadges = ({ user }) => {
  const { badges, badgeProgress } = getUserBadges(user?.quizHistory);

  return (
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        🏅 Achievements
      </h3>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {badges.map((b, i) => (
          <span
            key={i}
            className="flex items-center bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
          >
            {b.emoji} {b.label}
          </span>
        ))}
      </div>

      {badgeProgress ? (
        <div className="max-w-xs mx-auto text-sm text-gray-700 dark:text-gray-200">
          <p className="mb-1">
            Progress to:{" "}
            <strong>
              {badgeProgress.emoji} {badgeProgress.label}
            </strong>
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-yellow-400 h-4 rounded-full transition-all"
              style={{ width: `${badgeProgress.progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs">{badgeProgress.progress}% completed</p>
        </div>
      ) : (
        <p className="text-sm text-green-500 mt-2">
          🎉 All quiz badges unlocked!
        </p>
      )}
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
