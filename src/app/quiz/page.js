// app/quiz/page.js
import { Suspense } from "react";
import QuizClientComponent from "./ClientQuizPage";

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizClientComponent />
    </Suspense>
  );
}
