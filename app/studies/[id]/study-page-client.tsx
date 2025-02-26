"use client";

import { useState } from "react";
import { DualViewer } from "@/app/components/dicom-viewer/dual-viewer";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Loader2, 
  FileText, 
  Brain, 
  ZoomIn,
  Move,
  Ruler,
  Undo2,
  Info,
  ChevronRight,
  Check,
  X, 
  LayoutDashboard, 
  ArrowLeft 
} from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import Link from "next/link";

interface Finding {
  id: string;
  label: string;
  confidence: number;
  location?: string;
  status?: "accepted" | "rejected" | "pending";
}

interface StudyPageClientProps {
  studyId: string;
}

export function StudyPageClient({ studyId }: StudyPageClientProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("pan");
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  
  // Simulate running an analysis
  function runAnalysis() {
    setIsAnalyzing(true);
    setAnalyzingProgress(0);
    
    // Simulate API call with progress
    const interval = setInterval(() => {
      setAnalyzingProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          // Mock findings data
          const mockFindings: Finding[] = [
            {
              id: "1",
              label: "Pulmonary Nodule",
              confidence: 0.92,
              location: "Right Upper Lobe",
              status: "pending"
            },
            {
              id: "2",
              label: "Pleural Effusion",
              confidence: 0.78,
              location: "Left Lower Lobe",
              status: "pending"
            },
            {
              id: "3",
              label: "Consolidation",
              confidence: 0.65,
              location: "Right Middle Lobe",
              status: "pending"
            }
          ];
          
          setTimeout(() => {
            setFindings(mockFindings);
            setIsAnalyzing(false);
            setHasAnalyzed(true);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  }
  
  // Function to determine badge color based on confidence
  function getConfidenceBadgeVariant(confidence: number) {
    if (confidence >= 0.9) return "destructive";
    if (confidence >= 0.7) return "default";
    return "secondary";
  }
  
  // Handle finding status change
  function updateFindingStatus(id: string, status: "accepted" | "rejected") {
    setFindings(prevFindings => 
      prevFindings.map(finding => 
        finding.id === id ? { ...finding, status } : finding
      )
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              asChild
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Study: {studyId.slice(0, 8)}
                {isAnalyzing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </h1>
              <p className="text-sm text-muted-foreground">
                Uploaded on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled={!hasAnalyzed} asChild>
              <a href="#" download>
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </a>
            </Button>
            <Button
              size="sm"
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  {hasAnalyzed ? "Re-analyze" : "Analyze Image"}
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={analyzingProgress} className="h-2" />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Analyzing image...</span>
              <span>{analyzingProgress}%</span>
            </div>
          </div>
        )}
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="py-3 px-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Image Viewer</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant={selectedTool === "zoom" ? "secondary" : "ghost"} 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => setSelectedTool("zoom")}
                    >
                      <ZoomIn className="h-4 w-4" />
                      <span className="sr-only">Zoom</span>
                    </Button>
                    
                    <Button 
                      variant={selectedTool === "pan" ? "secondary" : "ghost"} 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => setSelectedTool("pan")}
                    >
                      <Move className="h-4 w-4" />
                      <span className="sr-only">Pan</span>
                    </Button>
                    
                    <Button 
                      variant={selectedTool === "measure" ? "secondary" : "ghost"} 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => setSelectedTool("measure")}
                    >
                      <Ruler className="h-4 w-4" />
                      <span className="sr-only">Measure</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => setSelectedTool("reset")}
                    >
                      <Undo2 className="h-4 w-4" />
                      <span className="sr-only">Reset</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <DualViewer 
                studyId={studyId} 
                className="aspect-square lg:aspect-[4/3]" 
              />
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-base">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Patient ID</p>
                  <p className="font-medium">PT12345</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Age</p>
                  <p className="font-medium">45</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Gender</p>
                  <p className="font-medium">Male</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Study Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Modality</p>
                  <p className="font-medium">CT</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Study Description</p>
                  <p className="font-medium">Chest CT</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Referring Physician</p>
                  <p className="font-medium">Dr. Smith</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">AI Analysis Results</CardTitle>
                  {findings.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {findings.length} findings
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {!hasAnalyzed ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <Brain className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      Run analysis to detect abnormalities in this image.
                    </p>
                    <Button
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="mt-4"
                      size="sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                  </div>
                ) : findings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-green-100 p-2 mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-base font-medium">No findings detected</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[80%]">
                      The AI did not detect any abnormalities in this image.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {findings.map((finding) => (
                      <div key={finding.id} className="py-3 px-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{finding.label}</h4>
                          <Badge variant={getConfidenceBadgeVariant(finding.confidence)}>
                            {Math.round(finding.confidence * 100)}%
                          </Badge>
                        </div>
                        {finding.location && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {finding.location}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed">
                          <span className="text-xs text-muted-foreground">
                            Finding #{finding.id}
                          </span>
                          <div className="flex gap-2">
                            {finding.status === "accepted" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="mr-1 h-3 w-3" />
                                Accepted
                              </Badge>
                            ) : finding.status === "rejected" ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <X className="mr-1 h-3 w-3" />
                                Rejected
                              </Badge>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                  onClick={() => updateFindingStatus(finding.id, "rejected")}
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => updateFindingStatus(finding.id, "accepted")}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Accept
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {findings.length > 0 && (
                <CardFooter className="border-t p-4 flex justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-1">Status:</span>
                    <span className="font-medium">
                      {findings.filter(f => f.status === "accepted").length} accepted, 
                      {" "}{findings.filter(f => f.status === "rejected").length} rejected,
                      {" "}{findings.filter(f => f.status === "pending").length} pending
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={findings.some(f => f.status === "pending")}
                    className="gap-1"
                  >
                    Complete Review
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-base">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Help & Information
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Viewing Tools</h4>
                  <p className="text-muted-foreground">
                    Use the toolbar above the image to zoom, pan, or measure the image.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">AI Analysis</h4>
                  <p className="text-muted-foreground">
                    Click "Analyze Image" to run the AI algorithm. Review the findings by accepting or rejecting them.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Export Report</h4>
                  <p className="text-muted-foreground">
                    After reviewing findings, you can export a structured report as PDF.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 