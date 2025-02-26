"use client";

import { useEffect, useRef, useState } from "react";
import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import { Button } from "@/app/components/ui/button";
import { Loader2, ZoomIn, Move, Ruler, Search, RefreshCw, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
// import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

// Simple canvas-based fallback viewer when cornerstone fails completely
interface FallbackViewerProps {
  className?: string;
  studyId?: string;
}

function FallbackViewer({ className, studyId }: FallbackViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Draw a simple placeholder pattern
    const width = canvas.width;
    const height = canvas.height;
    
    // Fill background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw circle in the center
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = '#666';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DICOM Fallback View', width / 2, height / 2 - 120);
    
    if (studyId) {
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Study ID: ${studyId}`, width / 2, height / 2 - 90);
    }
    
    // Draw cross in the center
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(width / 2 - 50, height / 2);
    ctx.lineTo(width / 2 + 50, height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 50);
    ctx.lineTo(width / 2, height / 2 + 50);
    ctx.stroke();
    
  }, [canvasRef, studyId]);
  
  return (
    <div className={cn("relative rounded-lg overflow-hidden bg-gray-900", className)}>
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className="w-full aspect-square"
      />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded-md">
        <Info className="h-4 w-4 text-amber-500" />
        <span className="text-xs text-gray-300">Fallback mode - Limited functionality</span>
      </div>
      
      <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-md text-xs text-gray-300">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Study:</span>
            <span>{studyId || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Mode:</span>
            <span>Compatibility View</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error component for DICOM viewer issues
interface DicomViewerErrorProps {
  message: string;
  onRetry?: () => void;
  onFallback?: () => void;
}

function DicomViewerError({ message, onRetry, onFallback }: DicomViewerErrorProps) {
  let detailedMessage = '';
  
  // Provide more detailed messages based on error
  if (message.includes('EVENTS')) {
    detailedMessage = 'This appears to be a compatibility issue with the DICOM viewer library.';
  } else if (message.includes('tools')) {
    detailedMessage = 'The DICOM tools could not be initialized properly.';
  } else if (message.includes('Failed to load image')) {
    detailedMessage = 'Could not load the DICOM image data. Please check your connection.';
  } else if (message.includes('Failed to initialize')) {
    detailedMessage = 'The DICOM viewer could not be initialized. This might be due to browser compatibility issues.';
  } else if (message.includes('extensible')) {
    detailedMessage = 'There was a problem with internal browser features needed by the DICOM viewer.';
  }
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-4 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
      <p className="text-red-500 font-medium mb-2">{message}</p>
      <p className="text-gray-400 text-sm max-w-md mb-4">
        {detailedMessage || 'There was a problem with the DICOM viewer. This might be due to an incompatibility with your browser or a temporary issue.'}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
        {onFallback && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onFallback}
            className="gap-2"
          >
            <Info className="h-4 w-4" />
            Use Fallback Viewer
          </Button>
        )}
      </div>
    </div>
  );
}

// Store browser feature detection results separately instead of on the cornerstone object
const BrowserFeatures = {
  SUPPORT_POINTER_EVENTS: false,
  // Add any other features we need to detect
};

// Detect browser features just once at component initialization
function detectBrowserFeatures() {
  if (typeof window === 'undefined') return;
  
  try {
    // Check for pointer events support
    BrowserFeatures.SUPPORT_POINTER_EVENTS = 'onpointerdown' in window;
    console.log('Browser feature detection complete');
  } catch (e) {
    console.warn('Error during browser feature detection:', e);
  }
}

// Implement a simpler file loader function
function loadImageFromFile(imageId: string) {
  const filePromise = fetch(imageId.replace('dicomFile:', ''))
    .then(response => response.arrayBuffer());
  
  const parseAndLoad = (arrayBuffer: ArrayBuffer) => {
    // Parse the DICOM P10 byte stream
    try {
      const byteArray = new Uint8Array(arrayBuffer);
      const dataSet = dicomParser.parseDicom(byteArray);

      // Extract image attributes
      const pixelDataElement = dataSet.elements.x7fe00010;
      const rows = dataSet.uint16('x00280010');
      const cols = dataSet.uint16('x00280011');
      const samplesPerPixel = dataSet.uint16('x00280002') || 1;
      const bitsAllocated = dataSet.uint16('x00280100') || 8;
      
      let pixelData;
      if (bitsAllocated === 8) {
        pixelData = new Uint8Array(
          arrayBuffer, 
          pixelDataElement.dataOffset, 
          pixelDataElement.length
        );
      } else {
        pixelData = new Uint16Array(
          arrayBuffer, 
          pixelDataElement.dataOffset, 
          pixelDataElement.length / 2
        );
      }
      
      const windowCenter = dataSet.floatString('x00281050') || 127;
      const windowWidth = dataSet.floatString('x00281051') || 256;
      
      const image = {
        imageId,
        minPixelValue: 0,
        maxPixelValue: bitsAllocated === 8 ? 255 : 65535,
        slope: dataSet.floatString('x00281053') || 1,
        intercept: dataSet.floatString('x00281052') || 0,
        windowCenter,
        windowWidth,
        rows,
        columns: cols,
        height: rows,
        width: cols,
        color: samplesPerPixel === 3,
        columnPixelSpacing: dataSet.floatString('x00280030') || 1,
        rowPixelSpacing: dataSet.floatString('x00280030', 1) || 1,
        sizeInBytes: pixelData.byteLength,
        getPixelData: () => pixelData
      };
      
      return image;
    } catch (error) {
      console.error('Error parsing DICOM file', error);
      throw error;
    }
  };
  
  const promise = filePromise.then(parseAndLoad);
  
  return {
    promise
  };
}

const initCornerstone = () => {
  if (typeof window === 'undefined') return false;

  try {
    console.log('Initializing cornerstone libraries with alternate approach...');
    
    // Check for browser features first
    detectBrowserFeatures();
    
    // Safely set up external references
    try {
      // Instead of directly assigning to external, use cornerstoneTools.external if it exists
      const toolsRef = cornerstoneTools as any;
      if (toolsRef && toolsRef.external) {
        console.log('Setting cornerstone on cornerstoneTools.external');
        toolsRef.external.cornerstone = cornerstone;
      } else {
        console.warn('cornerstoneTools.external not available, cannot set cornerstone reference');
      }
    } catch (err) {
      console.warn('Error setting up cornerstoneTools external references:', err);
    }
    
    // Let's register loaders directly without trying to modify cornerstone objects
    try {
      // Register our simple image loader
      cornerstone.registerImageLoader('dicomFile', loadImageFromFile);
      cornerstone.registerImageLoader('wadouri', loadImageFromFile);
      console.log('Registered image loaders successfully');
    } catch (e) {
      console.warn('Error registering image loaders:', e);
    }
    
    // Try initializing cornerstone tools
    try {
      if (typeof cornerstoneTools.init === 'function') {
        cornerstoneTools.init();
        console.log('cornerstoneTools initialized successfully');
      } else {
        console.warn('cornerstoneTools.init is not available');
      }
    } catch (initErr) {
      console.warn('Error initializing cornerstoneTools:', initErr);
    }
    
    console.log('Cornerstone initialization completed using alternate approach');
    return true;
  } catch (error) {
    console.error('Fatal error initializing cornerstone:', error);
    return false;
  }
};

// Helper function to create a placeholder image
function createPlaceholderImage() {
  // Create a simulated X-ray image (512x512 grayscale)
  const width = 512;
  const height = 512;
  const pixelData = new Uint16Array(width * height);
  
  // Base background (lighter in center, darker at edges - like a real X-ray)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate distance from center (for vignette effect)
      const centerX = width / 2;
      const centerY = height / 2;
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      
      // Create a more prominent vignette effect (typical in X-rays)
      let value = 3500 - (distanceFromCenter / maxDistance) * 3000; 
      
      // Add subtle noise for realistic film grain
      value += Math.random() * 120 - 60;
      
      pixelData[y * width + x] = Math.max(0, Math.min(4095, Math.floor(value)));
    }
  }
  
  // ----- REALISTIC CHEST X-RAY FEATURES -----
  
  // Draw lungs (lighter areas with proper gradient)
  const lungWidth = width * 0.22;
  const lungHeight = height * 0.35;
  const lungYPos = height * 0.38;
  const lungSpacing = width * 0.2; 
  
  // Left lung (slightly smaller than right in real X-rays)
  const leftLungX = width / 2 - lungSpacing / 2 - lungWidth * 0.95;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Oval shape for left lung with slight angle
      const normX = ((x - leftLungX - lungWidth/2) / (lungWidth/2)) * 1.1;
      const normY = ((y - lungYPos - lungHeight/2) / (lungHeight/2)) * 0.9;
      const dist = normX * normX + normY * normY;
      
      if (dist < 1) {
        // Create gradient for more realistic lung appearance
        pixelData[y * width + x] += 850 * (1 - dist * 0.7);
      }
    }
  }
  
  // Right lung (slightly larger in real X-rays)
  const rightLungX = width / 2 + lungSpacing / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Oval shape for right lung with slight angle
      const normX = ((x - rightLungX - lungWidth/2) / (lungWidth/2)) * 1.1;
      const normY = ((y - lungYPos - lungHeight/2) / (lungHeight/2)) * 0.9;
      const dist = normX * normX + normY * normY;
      
      if (dist < 1) {
        // Create gradient for more realistic lung appearance
        pixelData[y * width + x] += 850 * (1 - dist * 0.7);
      }
    }
  }
  
  // Draw diaphragm (the curved line at bottom of lungs)
  const diaphragmY = lungYPos + lungHeight * 0.9;
  const diaphragmWidth = width * 0.7;
  const diaphragmHeight = 40;
  
  for (let x = (width - diaphragmWidth) / 2; x < (width + diaphragmWidth) / 2; x++) {
    const xRatio = (x - ((width - diaphragmWidth) / 2)) / diaphragmWidth;
    const yOffset = Math.sin(xRatio * Math.PI) * diaphragmHeight;
    
    for (let y = diaphragmY - yOffset; y < diaphragmY - yOffset + 8; y++) {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        pixelData[Math.floor(y) * width + Math.floor(x)] = Math.max(0, pixelData[Math.floor(y) * width + Math.floor(x)] - 1600);
      }
    }
  }
  
  // Draw ribcage (curved lines with increasing spaces between lower ribs)
  const ribCount = 10;
  const ribStartY = height * 0.25;
  const ribSpacing = 20; 
  const ribWidth = width * 0.75;
  
  for (let rib = 0; rib < ribCount; rib++) {
    // More spacing between lower ribs (realistic anatomy)
    const spacingFactor = 1 + (rib / ribCount) * 0.5;
    const ribY = ribStartY + rib * ribSpacing * spacingFactor;
    
    // Ribs curve more at the sides
    const curveFactor = 0.00045; 
    
    for (let x = (width - ribWidth) / 2; x < (width + ribWidth) / 2; x++) {
      // Calculate curved Y position for rib with increased curvature at sides
      const distFromCenter = Math.abs(x - width/2);
      const offset = Math.pow(distFromCenter, 1.8) * curveFactor;
      const y = Math.floor(ribY + offset);
      
      if (y >= 0 && y < height) {
        // Make ribs more visible with proper density
        const ribThickness = 3 - (rib % 2); // Alternating thickness
        
        // Draw ribs with appropriate thickness
        for (let thickness = -ribThickness/2; thickness <= ribThickness/2; thickness++) {
          const yPos = y + Math.floor(thickness);
          if (yPos >= 0 && yPos < height) {
            // Alternating density and proper bone appearance
            const ribIntensity = 2200 - (rib % 2) * 400;
            pixelData[yPos * width + x] = Math.max(0, pixelData[yPos * width + x] - ribIntensity);
          }
        }
      }
    }
  }
  
  // Draw spine (vertical line in center with vertebrae)
  const spineWidth = 22;
  const spineCenterX = width / 2;
  const spineHeight = height * 0.65;
  const spineYPos = height * 0.2;
  
  // Draw vertebrae
  const vertebraeCount = 18;
  const vertebraeSpacing = spineHeight / vertebraeCount;
  
  for (let i = 0; i < vertebraeCount; i++) {
    const vertebraY = spineYPos + i * vertebraeSpacing;
    const vertebraHeight = vertebraeSpacing * 0.65;
    
    // Vertebral bodies (appear as small rounded rectangles)
    for (let y = vertebraY; y < vertebraY + vertebraHeight; y++) {
      for (let x = spineCenterX - spineWidth/2; x < spineCenterX + spineWidth/2; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          // Proper vertebral body density
          pixelData[Math.floor(y) * width + Math.floor(x)] = Math.max(0, pixelData[Math.floor(y) * width + Math.floor(x)] - 2400);
        }
      }
    }
    
    // Intervertebral spaces
    for (let y = vertebraY + vertebraHeight; y < vertebraY + vertebraeSpacing; y++) {
      for (let x = spineCenterX - spineWidth/2; x < spineCenterX + spineWidth/2; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          // Disc spaces are less dense than vertebrae
          pixelData[Math.floor(y) * width + Math.floor(x)] = Math.max(0, pixelData[Math.floor(y) * width + Math.floor(x)] - 900);
        }
      }
    }
  }
  
  // Draw heart (realistic cardiac silhouette) - left sided, oval shaped
  const heartCenterX = width * 0.4; // Left of center as in real anatomy
  const heartCenterY = height * 0.43;
  const heartWidth = width * 0.28;
  const heartHeight = height * 0.3;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // More anatomically correct heart shape 
      const normX = (x - heartCenterX) / heartWidth;
      const normY = (y - heartCenterY) / heartHeight;
      // Slightly angled cardiac silhouette
      const dist = Math.pow(normX * 1.1, 2) + Math.pow(normY * 0.9, 2);
      
      if (dist < 1) {
        // Proper cardiac density with gradient
        const intensity = 1800 * (1 - dist * 0.8);
        pixelData[y * width + x] = Math.max(0, pixelData[y * width + x] - intensity);
      }
    }
  }
  
  // Add clavicles (collar bones)
  const clavicleY = height * 0.22;
  const clavicleLength = width * 0.33;
  const clavicleThickness = 6;
  const clavicleAngle = 0.18; // slight upward angle
  
  // Left clavicle
  for (let i = 0; i < clavicleLength; i++) {
    const x = spineCenterX - i;
    const y = clavicleY - i * clavicleAngle;
    
    if (x >= 0 && x < width) {
      for (let t = -clavicleThickness/2; t < clavicleThickness/2; t++) {
        const yPos = Math.floor(y + t);
        if (yPos >= 0 && yPos < height) {
          pixelData[yPos * width + x] = Math.max(0, pixelData[yPos * width + x] - 2000);
        }
      }
    }
  }
  
  // Right clavicle
  for (let i = 0; i < clavicleLength; i++) {
    const x = spineCenterX + i;
    const y = clavicleY - i * clavicleAngle;
    
    if (x >= 0 && x < width) {
      for (let t = -clavicleThickness/2; t < clavicleThickness/2; t++) {
        const yPos = Math.floor(y + t);
        if (yPos >= 0 && yPos < height) {
          pixelData[yPos * width + x] = Math.max(0, pixelData[yPos * width + x] - 2000);
        }
      }
    }
  }
  
  // Add some mediastinal structures (trachea, etc.)
  const tracheaWidth = 12;
  for (let y = height * 0.25; y < height * 0.4; y++) {
    for (let x = spineCenterX - tracheaWidth/2; x < spineCenterX + tracheaWidth/2; x++) {
      if (x >= 0 && x < width) {
        // Air in trachea appears darker
        const airDensity = 800 + Math.random() * 200;
        pixelData[Math.floor(y) * width + Math.floor(x)] += airDensity;
      }
    }
  }
  
  // Add text marker for demo purposes with proper positioning
  const textY = height * 0.95;
  const textX = width * 0.1;
  addTextToImage(pixelData, width, "DEMO X-RAY", textX, textY);
  
  // Create a cornerstone-like image object
  return {
    imageId: 'dicomFile://placeholder',
    minPixelValue: 0,
    maxPixelValue: 4096,
    slope: 1.0,
    intercept: 0,
    windowCenter: 2000,  // Keep these values consistent
    windowWidth: 4000,   // Keep these values consistent
    getPixelData: () => pixelData,
    rows: height,
    columns: width,
    height,
    width,
    color: false,
    sizeInBytes: pixelData.byteLength,
    columnPixelSpacing: 1.0,
    rowPixelSpacing: 1.0
  };
}

// Helper function to add text to the simulated X-ray
function addTextToImage(pixelData: Uint16Array, width: number, text: string, x: number, y: number) {
  // Simple bitmap font implementation
  // Each letter is a 5x7 bitmap
  const fontMap: {[key: string]: number[]} = {
    'D': [31, 17, 17, 17, 17, 17, 31],
    'E': [31, 16, 16, 31, 16, 16, 31],
    'M': [17, 27, 21, 21, 17, 17, 17],
    'O': [14, 17, 17, 17, 17, 17, 14],
    'X': [17, 17, 10, 4, 10, 17, 17],
    'R': [30, 17, 17, 30, 20, 18, 17],
    'A': [14, 17, 17, 31, 17, 17, 17],
    'Y': [17, 17, 10, 4, 4, 4, 4],
    '-': [0, 0, 0, 31, 0, 0, 0],
    ' ': [0, 0, 0, 0, 0, 0, 0]
  };
  
  let cursorX = x;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    const bitmap = fontMap[char] || fontMap[' '];
    
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (bitmap[row] & (1 << (4 - col))) {
          const pixelX = cursorX + col;
          const pixelY = y + row;
          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < width) {
            // Make text bright white
            pixelData[pixelY * width + pixelX] = 4000;
          }
        }
      }
    }
    cursorX += 6; // 5 pixels plus 1 space between characters
  }
}

interface DicomViewerProps {
  studyId?: string;
  className?: string;
}

// Detect macOS browsers which often have issues with cornerstone
function isMacOSBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.indexOf('mac') !== -1;
  const isSafari = userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1;
  
  return isMac && (isSafari || userAgent.indexOf('firefox') !== -1);
}

export default function DicomViewer({ studyId, className }: DicomViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasFallbackRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<string>('Wwwc');
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [useDirectCanvas, setUseDirectCanvas] = useState(false);
  
  // Create a standalone runtime cache for enabled elements
  const runtimeCache = new Map();
  const cornerstoneInitialized = useRef(false);
  const [windowLevel, setWindowLevel] = useState({ center: 2000, width: 4000 });  // Default values set here

  // Create wrapper functions for cornerstone methods to avoid modifying the frozen object
  const customGetEnabledElement = (el: HTMLElement) => {
    if (runtimeCache.has(el)) {
      return runtimeCache.get(el);
    }
    
    // Try the original method if available
    try {
      if (cornerstone && typeof cornerstone.getEnabledElement === 'function') {
        return cornerstone.getEnabledElement(el);
      }
    } catch (error) {
      console.warn('Error calling original getEnabledElement:', error);
    }
    
    return null;
  };

  const customDisplayImage = (el: HTMLElement, image: any) => {
    if (!el) return;
    
    const canvas = el.querySelector('canvas');
    if (!canvas) {
      console.warn('No canvas found in the element for displayImage');
      return;
    }
    
    // Get or create an enabled element record
    let enabledElement = customGetEnabledElement(el);
    if (!enabledElement) {
      enabledElement = {
        element: el,
        canvas: canvas,
        image: null,
        invalid: false,
        needsRedraw: true,
        options: {
          renderer: '',
        },
        layers: [],
        data: {},
        renderingTools: {},
      };
      runtimeCache.set(el, enabledElement);
    }
    
    // Update the image
    enabledElement.image = image;
    enabledElement.needsRedraw = true;
    
    try {
      // Try using the original cornerstone method if available
      if (cornerstone && typeof cornerstone.displayImage === 'function') {
        return cornerstone.displayImage(el, image);
      }
      
      // Otherwise, use our fallback rendering
      renderToCanvas(canvas, image, windowLevel);
    } catch (error) {
      console.warn('Error in customDisplayImage:', error);
      // Fallback to our own rendering
      renderToCanvas(canvas, image, windowLevel);
    }
  };

  // Render image data to canvas
  const renderToCanvas = (canvas: HTMLCanvasElement, image: any, windowLevel: {center: number, width: number}) => {
    if (!canvas || !image || !image.getPixelData) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      // Get image dimensions
      const imageWidth = image.width || 512;
      const imageHeight = image.height || 512;
      
      // Make sure canvas size matches image size
      if (canvas.width !== imageWidth || canvas.height !== imageHeight) {
        canvas.width = imageWidth;
        canvas.height = imageHeight;
      }
      
      // Get the pixel data
      const pixelData = image.getPixelData();
      if (!pixelData) return;
      
      // Create ImageData
      const imageData = ctx.createImageData(imageWidth, imageHeight);
      const rgba = imageData.data;
      
      // Apply windowing (convert from 16-bit to 8-bit with specified window/level)
      const center = windowLevel.center || image.windowCenter || 2000;
      const windowWidth = windowLevel.width || image.windowWidth || 4000;
      const low = center - windowWidth / 2;
      const high = center + windowWidth / 2;
      
      // Enhanced windowing algorithm with gamma correction for better X-ray appearance
      const gamma = 1.2; // Slight gamma correction for better contrast
      
      // Process each pixel
      for (let i = 0, j = 0; i < pixelData.length; i++, j += 4) {
        // Apply window level transform
        let pixelValue = pixelData[i];
        let normalizedValue = 0;
        
        if (pixelValue <= low) {
          normalizedValue = 0;
        } else if (pixelValue >= high) {
          normalizedValue = 255;
        } else {
          // Apply linear transformation with gamma correction
          let linearValue = (pixelValue - low) / (high - low);
          // Apply gamma correction
          normalizedValue = Math.round(Math.pow(linearValue, 1/gamma) * 255);
        }
        
        // Invert colors for X-ray-like appearance (black bones on white background)
        normalizedValue = 255 - normalizedValue;
        
        // Set RGBA values - grayscale so R=G=B
        rgba[j] = normalizedValue;     // R
        rgba[j + 1] = normalizedValue; // G
        rgba[j + 2] = normalizedValue; // B
        rgba[j + 3] = 255;             // A (fully opaque)
      }
      
      // Put the image data on the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Add demo overlay text
      ctx.fillStyle = 'rgba(255, 255, 150, 0.7)';
      ctx.font = '20px Arial';
      ctx.fillText('DEMO X-RAY', 20, 30);
    } catch (err) {
      console.error('Error rendering to canvas:', err);
    }
  };

  // Initialize Cornerstone
  useEffect(() => {
    if (!viewportRef.current || useFallback) {
      return;
    }

    // Detect browser compatibility issues proactively
    if (isMacOSBrowser() && typeof window !== 'undefined' && !window.PointerEvent) {
      console.warn('Detected potentially incompatible browser environment. Using fallback mode.');
      setError('Your browser may not be fully compatible with the DICOM viewer.');
      setUseFallback(true);
      return;
    }

    const initializeViewer = () => {
      try {
        console.log('Initializing DICOM viewer...');
        setIsLoading(true);
        
        // Initialize the cornerstone core
        const initialized = initCornerstone();
        if (!initialized) {
          throw new Error('Cornerstone initialization failed');
        }
        
        // Initialize tools if possible
        try {
          if (typeof cornerstoneTools.addTool === 'function') {
            // Add essential tools
            const toolsMap = {
              WwwcTool: cornerstoneTools.WwwcTool,
              ZoomTool: cornerstoneTools.ZoomTool,
              PanTool: cornerstoneTools.PanTool,
              LengthTool: cornerstoneTools.LengthTool
            };
            
            // Add each tool with error handling
            Object.entries(toolsMap).forEach(([name, tool]) => {
              if (tool) {
                try {
                  cornerstoneTools.addTool(tool);
                } catch (e) {
                  console.warn(`Failed to add ${name}:`, e);
                }
              }
            });
          }
        } catch (toolsError) {
          console.warn('Error setting up tools:', toolsError);
          // Continue even if tool setup fails
        }
        
        const element = viewportRef.current;
        if (!element) {
          throw new Error('Viewport element not found');
        }
        
        // Clear existing content
        element.innerHTML = '';
        
        // Create new canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;  // Fixed size to match our demo image
        canvas.height = 512;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'contain';
        element.appendChild(canvas);
        
        // Store the element in our cache
        const enabledElement = {
          element,
          canvas,
          image: null,
          invalid: false,
          needsRedraw: true
        };
        runtimeCache.set(element, enabledElement);
        
        // Load and display the demo image
        console.log('Loading demo image...');
        const image = createPlaceholderImage();
        console.log('Demo image created with dimensions:', image.width, 'x', image.height);
        
        // Display the image using our custom method
        renderToCanvas(canvas, image, windowLevel);
        
        // Update state to indicate loading is complete
        setIsLoaded(true);
        setIsLoading(false);
        
        // Try to set initial tool if available
        try {
          if (typeof cornerstoneTools.setToolActive === 'function') {
            cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
            setActiveTool('Wwwc');
          }
        } catch (toolError) {
          console.warn('Tool initialization error:', toolError);
        }
        
        console.log('DICOM viewer initialization complete');
      } catch (err) {
        console.error('Error initializing DICOM viewer:', err);
        setIsLoading(false);
        setError('Failed to initialize the DICOM viewer. Using fallback mode.');
        setUseFallback(true);
      }
    };
    
    // Start initialization with a slight delay to prevent UI blocking
    setTimeout(initializeViewer, 100);
    
    // Cleanup function
    return () => {
      try {
        if (viewportRef.current) {
          // Clear the runtime cache for this element
          runtimeCache.delete(viewportRef.current);
          
          // Clear the element content
          viewportRef.current.innerHTML = '';
          
          console.log('DICOM viewer cleanup complete');
        }
      } catch (err) {
        console.warn('Error during cleanup:', err);
      }
    };
  }, [studyId, useFallback]);
  
  // Handle retrying after an error
  const handleRetry = () => {
    window.location.reload(); // Simple but effective retry mechanism
  };
  
  // Switch to fallback viewer
  const handleFallback = () => {
    setUseFallback(true);
    setIsLoading(false);
  };
  
  // Render fallback viewer if chosen
  if (useFallback) {
    return <FallbackViewer className={className} studyId={studyId} />;
  }
  
  // Simplified tool activation function
  function setToolActive(toolName: string) {
    if (!viewportRef.current || !isLoaded) return;
    
    try {
      if (typeof cornerstoneTools.setToolActive === 'function') {
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
        setActiveTool(toolName);
      }
    } catch (e) {
      console.warn(`Failed to set tool ${toolName} active:`, e);
    }
  }
  
  return (
    <div className={cn("relative rounded-lg bg-black overflow-hidden", className)}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      
      {error && (
        <DicomViewerError 
          message={error} 
          onRetry={handleRetry} 
          onFallback={handleFallback}
        />
      )}
      
      {!useDirectCanvas ? (
        <div 
          ref={viewportRef}
          className="w-full aspect-square bg-black flex items-center justify-center" 
          style={{ minHeight: '512px' }}
        />
      ) : (
        <div className="w-full aspect-square bg-black flex items-center justify-center" style={{ minHeight: '512px' }}>
          <canvas 
            ref={canvasFallbackRef}
            width={512}
            height={512}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      
      {isLoaded && !error && (
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-2 rounded-md text-xs text-gray-300 max-w-[240px]">
          <div className="flex items-center gap-2 mb-1">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="font-medium">Demo X-ray Image</span>
          </div>
          <p>This is a simulated chest X-ray for demonstration purposes.</p>
        </div>
      )}
      
      {!error && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            size="sm" 
            variant={activeTool === 'Wwwc' ? "default" : "secondary"}
            onClick={() => setToolActive('Wwwc')}
            title="Adjust window/level"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={activeTool === 'Zoom' ? "default" : "secondary"}
            onClick={() => setToolActive('Zoom')}
            title="Zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={activeTool === 'Pan' ? "default" : "secondary"}
            onClick={() => setToolActive('Pan')}
            title="Pan"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={activeTool === 'Length' ? "default" : "secondary"}
            onClick={() => setToolActive('Length')}
            title="Length measurement"
          >
            <Ruler className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 