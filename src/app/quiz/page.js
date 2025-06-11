import dynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ Dynamically import the Client Component (with no SSR)
const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), {
  ssr: false,
});

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading Quiz...</div>}
    >
      <ClientQuizPage />
    </Suspense>
  );
}
