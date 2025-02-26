'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Loader2, ZoomIn, Hand, Contrast } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

// Types
interface DicomViewerV3Props {
  studyId?: string;
  files?: File[];
  isDemo?: boolean;
}

// Error Component
const ErrorComponent = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-4">
    <div className="text-red-400 mb-4">{message}</div>
    <Button onClick={onRetry} variant="outline" className="bg-blue-600 hover:bg-blue-700">
      Retry
    </Button>
  </div>
);

// Loading Component
const LoadingComponent = () => (
  <div className="flex items-center justify-center h-full bg-gray-900">
    <div className="text-white flex items-center">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading DICOM...
    </div>
  </div>
);

// Main Component
const DicomViewerV3: React.FC<DicomViewerV3Props> = ({ studyId, files, isDemo }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('');
  const [cornerstoneLoaded, setCornerstoneLoaded] = useState(false);
  const [cornerstone, setCornerstone] = useState<any>(null);
  const [cornerstoneTools, setCornerstoneTools] = useState<any>(null);
  
  // Load Cornerstone dynamically
  useEffect(() => {
    let isMounted = true;
    
    const loadCornerstone = async () => {
      try {
        setIsLoading(true);
        
        // Dynamic imports to avoid Node.js module issues
        const cornerstoneCore = await import('@cornerstonejs/core');
        const cornerstoneToolsModule = await import('@cornerstonejs/tools');
        
        if (!isMounted) return;
        
        setCornerstone(cornerstoneCore);
        setCornerstoneTools(cornerstoneToolsModule);
        setCornerstoneLoaded(true);
      } catch (error) {
        console.error('Error loading Cornerstone libraries:', error);
        if (isMounted) {
          setError('Failed to load the DICOM viewer libraries. This is likely due to browser compatibility issues.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadCornerstone();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Initialize the Cornerstone libraries
  useEffect(() => {
    if (!cornerstoneLoaded || !cornerstone || !cornerstoneTools) return;
    
    const initialize = async () => {
      try {
        // Initialize cornerstone
        await cornerstone.init();
        
        // Initialize cornerstoneTools
        await cornerstoneTools.init();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Cornerstone:', error);
        setError('Failed to initialize DICOM viewer. Please try again or use the legacy viewer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
    
    return () => {
      if (cornerstone && isInitialized) {
        try {
          (cornerstone as any).destroy?.();
        } catch (error) {
          console.error('Error cleaning up Cornerstone:', error);
        }
      }
    };
  }, [cornerstoneLoaded, cornerstone, cornerstoneTools]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIsInitialized(false);
    setCornerstoneLoaded(false);
    
    // Force a reload of the component
    const timeout = setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return () => clearTimeout(timeout);
  };

  // Render error state
  if (error) {
    return <ErrorComponent message={error} onRetry={handleRetry} />;
  }

  // Render loading state
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 p-2 flex items-center justify-start gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`${activeTool === 'zoom' ? 'bg-blue-600' : ''}`}
          onClick={() => setActiveTool('zoom')}
        >
          <ZoomIn className="h-4 w-4 mr-1" />
          Zoom
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`${activeTool === 'pan' ? 'bg-blue-600' : ''}`}
          onClick={() => setActiveTool('pan')}
        >
          <Hand className="h-4 w-4 mr-1" />
          Pan
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`${activeTool === 'wwwc' ? 'bg-blue-600' : ''}`}
          onClick={() => setActiveTool('wwwc')}
        >
          <Contrast className="h-4 w-4 mr-1" />
          Window
        </Button>
        
        <Badge variant="outline" className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-300">
          Cornerstone3D Beta
        </Badge>
      </div>
      
      {/* Viewer */}
      <div ref={viewerRef} className="flex-grow bg-black relative">
        {!files?.length ? (
          <div className="flex items-center justify-center h-full text-white">
            No DICOM files loaded. Please select a study.
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <p className="mb-4">Cornerstone3D Viewer (Development Mode)</p>
              <p className="text-sm text-gray-400">
                This is a placeholder for the Cornerstone3D viewer.
                <br />
                In production, this would display your DICOM images.
              </p>
              {files.map((file, index) => (
                <div key={index} className="mt-2 text-sm text-gray-300">
                  Loaded: {file.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DicomViewerV3; 