import { Suspense } from "react";
import ClientQuizPage from "../../Components/ComponentsQuiz/ClientQuizPage";

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading Quiz...</div>}
    >
      <ClientQuizPage />
    </Suspense>
  );
}
