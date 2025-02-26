import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Layers, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter 
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface StudyCardProps {
  id: string;
  patientName: string;
  patientId: string;
  modality: string;
  date: string;
  status: "analyzed" | "pending" | "new";
}

function StudyCard({ id, patientName, patientId, modality, date, status }: StudyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{patientName}</CardTitle>
            <CardDescription>ID: {patientId}</CardDescription>
          </div>
          <Badge 
            variant={
              status === 'analyzed' ? 'default' :
              status === 'pending' ? 'secondary' : 'outline'
            }
            className={
              status === 'analyzed' ? 'bg-green-600' :
              status === 'pending' ? 'bg-amber-500' : 'bg-blue-500 text-white'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="text-muted-foreground">Modality:</div>
          <div className="font-medium">{modality}</div>
          <div className="text-muted-foreground">Date:</div>
          <div className="font-medium">{date}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button size="sm" variant="outline" asChild className="w-full">
          <Link href={`/studies/${id}`} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Study
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatCard({ title, value, icon: Icon, trend, description }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  description?: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? 
              <ArrowUpRight className="h-3 w-3" /> : 
              <ArrowDownRight className="h-3 w-3" />
            }
            <span>{trend.value} from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Mock data for demonstration
  const recentStudies: StudyCardProps[] = [
    {
      id: "1234abcd",
      patientName: "John Doe",
      patientId: "PT12345",
      modality: "X-Ray",
      date: "2023-06-15",
      status: "analyzed"
    },
    {
      id: "5678efgh",
      patientName: "Jane Smith",
      patientId: "PT54321",
      modality: "CT Scan",
      date: "2023-06-14",
      status: "pending"
    },
    {
      id: "9012ijkl",
      patientName: "Mike Johnson",
      patientId: "PT67890",
      modality: "MRI",
      date: "2023-06-13",
      status: "new"
    },
    {
      id: "3456mnop",
      patientName: "Sarah Williams",
      patientId: "PT34567",
      modality: "CT Scan",
      date: "2023-06-12",
      status: "analyzed"
    },
    {
      id: "7890qrst",
      patientName: "David Brown",
      patientId: "PT89012",
      modality: "X-Ray",
      date: "2023-06-11",
      status: "analyzed"
    },
    {
      id: "1234uvwx",
      patientName: "Lisa Garcia",
      patientId: "PT23456",
      modality: "MRI",
      date: "2023-06-10",
      status: "pending"
    }
  ];
  
  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your Scancer<span className="text-primary">AI</span> dashboard.
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/studies">
              <FileText className="mr-2 h-4 w-4" />
              All Studies
            </Link>
          </Button>
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Scan
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Studies" 
          value="128" 
          icon={Layers}
          description="Total studies analyzed and stored"
          trend={{ value: "12%", positive: true }}
        />
        <StatCard 
          title="Studies This Week" 
          value="24" 
          icon={Calendar}
          description="Studies uploaded since Monday"
          trend={{ value: "8%", positive: true }}
        />
        <StatCard 
          title="Average AI Confidence" 
          value="92%" 
          icon={BarChart3}
          description="Mean confidence score across studies"
          trend={{ value: "3%", positive: true }}
        />
        <StatCard 
          title="Pending Analysis" 
          value="5" 
          icon={Clock}
          description="Studies awaiting review"
          trend={{ value: "2", positive: false }}
        />
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recent">Recent Studies</TabsTrigger>
              <TabsTrigger value="analyzed">Analyzed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentStudies.map((study) => (
                <StudyCard key={study.id} {...study} />
              ))}
            </div>
            <div className="flex items-center justify-center">
              <Button variant="outline" asChild>
                <Link href="/studies">
                  View All Studies
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analyzed" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentStudies
                .filter(study => study.status === "analyzed")
                .map((study) => (
                  <StudyCard key={study.id} {...study} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentStudies
                .filter(study => study.status === "pending")
                .map((study) => (
                  <StudyCard key={study.id} {...study} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 