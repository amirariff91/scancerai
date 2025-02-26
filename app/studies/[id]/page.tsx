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

export default function StudyPage({ params }: StudyPageProps) {
  // Access the studyId directly from params
  const studyId = params.id;
  
  return (
    <StudyPageClient studyId={studyId} />
  );
} 