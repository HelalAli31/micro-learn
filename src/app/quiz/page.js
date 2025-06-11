// ❌ no "use client"
export const dynamic = "force-dynamic"; // ✅ prevent static generation

import dynamic from "next/dynamic";

// ✅ Dynamically load component only on client
const ClientQuizPage = dynamic(() => import("./ClientQuizPage"), {
  ssr: false, // 👈 this is key
  loading: () => <div>Loading quiz...</div>,
});

export default ClientQuizPage; // ✅ no Suspense
