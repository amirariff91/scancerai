// Server component - no "use client" directive
import { StudyPageClient } from "./study-page-client";

export default async function StudyPage({ params }: { params: { id: string } }) {
  // Await params before accessing its properties
  const unwrappedParams = await params;
  const studyId = unwrappedParams.id;
  
  return (
    <StudyPageClient studyId={studyId} />
  );
} 