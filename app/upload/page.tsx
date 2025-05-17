"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { FileImage, FileUp, FileX, Loader2, ChevronRight } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { FileInput } from "@/app/components/ui/file-input";
import { Progress } from "@/app/components/ui/progress";
import { 
  Alert,
  AlertDescription, 
  AlertTitle 
} from "@/app/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  
  function handleFilesSelected(selectedFiles: File[]) {
    setErrorMessage(null);
    
    // Filter for DICOM files or files without extension (DICOM often has no extension)
    const dicomFiles = selectedFiles.filter(
      file => file.name.toLowerCase().endsWith('.dcm') || 
      file.name.indexOf('.') === -1
    );
    
    if (dicomFiles.length === 0 && selectedFiles.length > 0) {
      setErrorMessage("No valid DICOM files were found. Please upload .dcm files.");
      return;
    }
    
    setFiles(dicomFiles);
  }
  
  function removeFile(index: number) {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }
  
  async function handleUpload() {
    if (files.length === 0) {
      setErrorMessage("Please select at least one DICOM file to upload.");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0); // Reset progress for new upload
    setErrorMessage(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // Use 'files' as the field name, matching the API
    });

    try {
      const response = await fetch('/api/upload-dicom', {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header when using FormData with fetch,
        // the browser will set it correctly with the boundary.
      });

      // Simulate progress for now, as fetch doesn't directly support upload progress
      // In a real app, you might use XMLHttpRequest or a library for progress.
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20; // Simulate progress
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 100); // Adjust timing as needed

      const result = await response.json();
      clearInterval(interval); // Clear simulation interval once response is received
      setUploadProgress(100); // Ensure progress shows 100%

      if (!response.ok) {
        setErrorMessage(result.error || `Upload failed with status: ${response.status}`);
        setIsUploading(false);
        return;
      }

      const { studyId } = result;
      if (studyId) {
        console.log('Upload successful, Study ID:', studyId, 'Files:', result.filePaths);
        // Redirect to the study page after a short delay
        setTimeout(() => {
          setIsUploading(false);
          router.push(`/studies/${studyId}`);
        }, 500);
      } else {
        setErrorMessage('Upload succeeded but did not receive a study ID.');
        setIsUploading(false);
      }

    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during upload.";
      setErrorMessage(`Upload failed: ${message}`);
      setIsUploading(false);
      setUploadProgress(0); // Reset progress on error
    }
  }
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Medical Images</h1>
        <p className="text-muted-foreground">
          Upload your medical images for AI-powered analysis. We support DICOM files.
        </p>
      </div>
      
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="demo">Use Demo Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload DICOM Images</CardTitle>
              <CardDescription>
                Upload your DICOM files for AI analysis. Supported formats: DICOM (.dcm)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileInput 
                accept=".dcm" 
                multiple 
                onFilesSelected={handleFilesSelected} 
                disabled={isUploading}
                label="Drag & drop your DICOM files here, or click to browse"
                icon={<FileImage className="h-8 w-8 text-muted-foreground" />}
              />
              
              {errorMessage && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {files.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        Selected Files ({files.length})
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFiles([])}
                        disabled={isUploading}
                        className="h-7 text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <ul className="max-h-48 overflow-y-auto divide-y">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between px-4 py-2 hover:bg-muted/50">
                        <div className="flex items-center gap-2 truncate">
                          <FileUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="h-6 w-6"
                        >
                          <FileX className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploading {files.length} file(s)...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload and Analyze
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Demo Images</CardTitle>
              <CardDescription>
                Try out ScancerAI with pre-loaded sample images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Chest X-Ray</CardTitle>
                    <CardDescription>Sample chest X-ray for detection demo</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => router.push('/studies/demo-chest-xray')}
                    >
                      Load Demo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Brain MRI</CardTitle>
                    <CardDescription>Sample brain MRI scan for analysis</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => router.push('/studies/demo-brain-mri')}
                    >
                      Load Demo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 