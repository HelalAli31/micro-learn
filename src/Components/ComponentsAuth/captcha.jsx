"use client";
import React from "react";
import { RefreshCcw } from "lucide-react";

const CaptchaSection = ({
  captchaType,
  challenge,
  answer,
  setAnswer,
  imageOptions,
  correctLabel,
  selectedIndexes,
  toggleSelect,
  generateArithmetic,
  generateImageCaptcha,
}) => {
  return (
    <div>
      {captchaType === "arithmetic" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Solve the CAPTCHA:
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              {challenge}
            </span>
            <button
              type="button"
              onClick={generateArithmetic}
              className="text-purple-600 dark:text-purple-400"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select all images containing:{" "}
            <b className="text-black dark:text-white">{correctLabel}</b>
          </label>
          <button
            type="button"
            onClick={generateImageCaptcha}
            className="text-purple-600 dark:text-purple-400 text-sm mb-2"
          >
            🔄 Refresh
          </button>
          <div className="grid grid-cols-3 gap-2">
            {imageOptions.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt="captcha-option"
                onClick={() => toggleSelect(i.toString())}
                className={`h-24 w-full object-cover rounded cursor-pointer border-4 ${
                  selectedIndexes.has(i.toString())
                    ? "border-purple-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptchaSection;
