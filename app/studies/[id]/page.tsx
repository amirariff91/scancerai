// Server component - no "use client" directive
import { StudyPageClient } from "./study-page-client";
import { Metadata } from "next";

interface StudyPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Study Details | ScancerAI',
  description: 'View detailed information about your medical scan',
};

export default async function StudyPage({ params: paramsProp }: StudyPageProps) {
  // Asynchronous access of `params.id`.
  const { id: studyId } = await paramsProp; // Await paramsProp and destructure id as studyId
  
  return (
    <StudyPageClient studyId={studyId} />
  );
} 