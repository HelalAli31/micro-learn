"use client";
export const dynamic = "force-dynamic"; // ⬅️ disables static generation!

import { Suspense } from "react";
import dynamic from "next/dynamic";

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
