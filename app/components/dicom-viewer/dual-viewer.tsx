"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamically import both viewers to avoid SSR issues
const DicomViewer = dynamic(() => import('./dicom-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white">Loading legacy DICOM viewer...</div>
    </div>
  ),
});

// Dynamically import the new viewer to avoid SSR issues
const DicomViewerV3 = dynamic(() => import('./dicom-viewer-v3'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white">Loading DICOM viewer...</div>
    </div>
  ),
});

interface DualViewerProps {
  studyId?: string;
  files?: File[];
  isDemo?: boolean;
  className?: string;
}

export const DualViewer: React.FC<DualViewerProps> = (props) => {
  const [useModernViewer, setUseModernViewer] = useState(false);
  const { className, ...viewerProps } = props;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-end p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mr-auto text-sm font-medium">
          {useModernViewer ? 'Using Cornerstone3D (Beta)' : 'Using Legacy Viewer'}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUseModernViewer(!useModernViewer)}
        >
          {useModernViewer ? 'Switch to Legacy Viewer' : 'Try Cornerstone3D (Beta)'}
        </Button>
      </div>
      
      <div className="flex-grow relative">
        {useModernViewer ? (
          <DicomViewerV3 {...viewerProps} />
        ) : (
          <DicomViewer {...viewerProps} />
        )}
      </div>
    </div>
  );
};

export default DualViewer; 