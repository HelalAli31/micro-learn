import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the client component so it's only rendered on the client
const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), {
  ssr: false,
  loading: () => <div>Loading quiz...</div>,
});

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <ClientQuizPage />
    </Suspense>
  );
}
