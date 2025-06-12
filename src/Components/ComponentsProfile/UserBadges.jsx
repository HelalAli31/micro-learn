"use client";

import React, { useState } from "react";

function getUserBadges(quizHistory) {
  const badges = [];

  const badgeLevels = [
    { label: "Beginner", emoji: "🐣", requiredQuizzes: 1, requiredScore: 0 },
    { label: "Learner", emoji: "📘", requiredQuizzes: 3, requiredScore: 0.5 },
    { label: "Brainiac", emoji: "🧠", requiredQuizzes: 5, requiredScore: 0.75 },
    { label: "Perfect Score", emoji: "🔥", special: "perfect" },
    { label: "Consistent", emoji: "📈", special: "streak" },
    { label: "Explorer", emoji: "🧭", requiredQuizzes: 7, requiredScore: 0.6 },
    {
      label: "Dedicated",
      emoji: "💪",
      requiredQuizzes: 10,
      requiredScore: 0.6,
    },
    {
      label: "Quiz Master",
      emoji: "🏆",
      requiredQuizzes: 15,
      requiredScore: 0.7,
    },
    { label: "Scholar", emoji: "📖", requiredQuizzes: 20, requiredScore: 0.8 },
    { label: "Legend", emoji: "👑", requiredQuizzes: 25, requiredScore: 0.85 },
  ];

  const totalQuizzes = quizHistory?.length || 0;
  const totalScore = quizHistory?.reduce((sum, q) => sum + (q.score || 0), 0);
  const totalQuestions = quizHistory?.reduce(
    (sum, q) => sum + (q.totalQuestions || 0),
    0
  );
  const avgScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

  const sortedDates = quizHistory
    ?.map((q) => new Date(q.dateTaken).toDateString())
    .filter(Boolean)
    .sort();

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    if (curr - prev === 86400000) streak++;
    else streak = 1;
  }

  const perfectScore = quizHistory?.some((q) => q.score === q.totalQuestions);

  const allBadges = badgeLevels.map((b) => {
    let earned = false;
    let progress = 0;

    if (b.special === "perfect") {
      earned = perfectScore;
      progress = earned ? 100 : 0;
    } else if (b.special === "streak") {
      earned = streak >= 3;
      progress = Math.min(100, Math.floor((streak / 3) * 100));
    } else {
      const quizProgress = Math.min(1, totalQuizzes / b.requiredQuizzes);
      const scoreProgress =
        b.requiredScore === 0 ? 1 : Math.min(1, avgScore / b.requiredScore);
      progress = Math.floor(quizProgress * scoreProgress * 100);
      earned = progress >= 100;
    }

    if (earned) {
      badges.push({ emoji: b.emoji, label: b.label });
    }

    return {
      ...b,
      progress,
      earned,
    };
  });

  const nextBadge = allBadges.find((b) => !b.earned && b.progress < 100);

  return {
    badges,
    badgeProgress: nextBadge
      ? {
          emoji: nextBadge.emoji,
          label: nextBadge.label,
          progress: nextBadge.progress,
        }
      : null,
    allBadges,
  };
}

const UserBadges = ({ user }) => {
  const { badges, badgeProgress, allBadges } = getUserBadges(user?.quizHistory);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="mt-6 text-center ">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        🏅 Achievements
      </h3>

      {/* Earned Badges */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {badges.map((b, i) => (
          <span
            key={i}
            className="flex items-center bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm"
          >
            {b.emoji} {b.label}
          </span>
        ))}
      </div>

      {/* Progress bar to next badge */}
      {badgeProgress ? (
        <div className="max-w-xs mx-auto text-sm text-gray-700 dark:text-gray-200 mb-4">
          <p className="mb-2">
            Progress to:{" "}
            <strong>
              {badgeProgress.emoji} {badgeProgress.label}
            </strong>
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-yellow-400 h-4 transition-all duration-300 ease-in-out"
              style={{ width: `${badgeProgress.progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-center">
            {badgeProgress.progress}% completed
          </p>
        </div>
      ) : (
        <p className="text-sm text-green-500 mb-4">
          🎉 All quiz badges unlocked!
        </p>
      )}

      {/* Show/Hide Toggle */}
      <button
        onClick={() => setShowTable((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-yellow-800
 hover:bg-blue-700 text-white rounded-lg text-sm transition"
      >
        {showTable ? "Hide Badge Table" : "Show All Badge Goals"}
      </button>

      {/* Badge Table */}
      {showTable && (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-md border dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-blue-200 dark:bg-blue-900 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="p-3 text-left">Badge</th>
                  <th className="p-3 text-left">Requirement</th>
                  <th className="p-3 text-left w-32">Progress</th>
                </tr>
              </thead>
              <tbody>
                {allBadges.map((b, i) => (
                  <tr
                    key={i}
                    className={`border-t dark:border-gray-700 ${
                      b.earned
                        ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {b.emoji} {b.label}{" "}
                      {b.earned && (
                        <span className="ml-1 text-green-600 dark:text-green-400">
                          ✅
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {b.special === "perfect"
                        ? "Scored 100% on at least one quiz"
                        : b.special === "streak"
                          ? "Completed quizzes 3 days in a row"
                          : `Completed ${b.requiredQuizzes}+ quizzes with avg score ≥ ${Math.floor(
                              b.requiredScore * 100
                            )}%`}
                    </td>
                    <td className="p-3">
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-yellow-400 h-3 rounded-full transition-all"
                          style={{ width: `${b.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{b.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadges;
