import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { FileText, Calendar, Lightbulb, Search } from "lucide-react";

interface Study {
  id: string;
  patientName: string;
  patientId: string;
  modality: string;
  date: string;
  status: "analyzed" | "pending" | "new";
  findings: number;
}

export default function StudiesPage() {
  // Mock data for demonstration
  const studies: Study[] = [
    {
      id: "1234abcd",
      patientName: "John Doe",
      patientId: "PT12345",
      modality: "X-Ray",
      date: "2023-06-15",
      status: "analyzed",
      findings: 2
    },
    {
      id: "5678efgh",
      patientName: "Jane Smith",
      patientId: "PT54321",
      modality: "CT Scan",
      date: "2023-06-14",
      status: "pending",
      findings: 0
    },
    {
      id: "9012ijkl",
      patientName: "Mike Johnson",
      patientId: "PT67890",
      modality: "MRI",
      date: "2023-06-13",
      status: "new",
      findings: 0
    },
    {
      id: "3456mnop",
      patientName: "Sarah Williams",
      patientId: "PT11111",
      modality: "X-Ray",
      date: "2023-06-12",
      status: "analyzed",
      findings: 1
    },
    {
      id: "7890qrst",
      patientName: "Robert Brown",
      patientId: "PT22222",
      modality: "CT Scan",
      date: "2023-06-11",
      status: "analyzed",
      findings: 3
    },
    {
      id: "1234uvwx",
      patientName: "Emily Davis",
      patientId: "PT33333",
      modality: "MRI",
      date: "2023-06-10",
      status: "pending",
      findings: 0
    }
  ];
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studies</h1>
          <p className="text-muted-foreground">
            View and manage all your medical imaging studies.
          </p>
        </div>
        <div className="mt-4 flex gap-2 sm:mt-0">
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button size="sm" asChild>
            <Link href="/upload">Upload New</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studies.map((study) => (
          <Card key={study.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{study.patientName}</CardTitle>
                <Badge variant={
                  study.status === 'analyzed' ? 'default' : 
                  study.status === 'pending' ? 'secondary' : 
                  'outline'
                }>
                  {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>ID: {study.patientId}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date:
                </div>
                <div>{study.date}</div>
                
                <div className="flex items-center text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Modality:
                </div>
                <div>{study.modality}</div>
                
                <div className="flex items-center text-muted-foreground">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Findings:
                </div>
                <div>
                  {study.findings > 0 ? (
                    <span className="font-medium text-destructive">{study.findings} detected</span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <Button variant="default" className="w-full" asChild>
                <Link href={`/studies/${study.id}`}>
                  View Study
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 