import Link from "next/link";
import Image from "next/image"; // Assuming you might want an image in the CTA like before
import { Button } from "@/app/components/ui/button";
import { 
  BrainCircuit, 
  FileText, 
  Microscope, 
  Scan, 
  Users, 
  ChevronRight,
  HeartPulse,
  FileClock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/app/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="relative w-full bg-gradient-to-b from-muted/50 to-background py-24 md:py-32">
        <div className="container flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex items-center justify-center rounded-full bg-primary/10 p-3 shadow-sm">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Medical Imaging Analysis <span className="text-primary">Powered by AI</span>
          </h1>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed xl:text-xl/relaxed">
            Scancer<span className="text-primary">AI</span> helps radiologists and clinicians diagnose faster and more accurately with AI-driven insights, reducing workload and improving patient outcomes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/upload" className="gap-2">
                <Scan className="h-5 w-5" />
                Upload a Scan
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard" className="gap-2">
                <FileText className="h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features section */}
      <section className="w-full py-16 md:py-24">
        <div className="container space-y-12">
          <div className="mx-auto text-center max-w-[800px] space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Transforming Medical Imaging with AI
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our platform delivers powerful tools to enhance your medical imaging workflow and improve diagnostic accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute right-2 top-2 h-20 w-20 opacity-5">
                <Scan className="h-full w-full" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  DICOM Viewing
                </CardTitle>
                <CardDescription>
                  Advanced browser-based DICOM viewer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload and view DICOM images directly in your browser with tools for zooming, panning, and measurements. Support for various modalities including X-ray, CT, and MRI.
                </p>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/upload">
                    Try Viewing
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute right-2 top-2 h-20 w-20 opacity-5">
                <BrainCircuit className="h-full w-full" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  AI Analysis
                </CardTitle>
                <CardDescription>
                  Automated detection in seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered insights with bounding boxes and confidence scores for potential findings. Our machine learning algorithms are trained on millions of medical images.
                </p>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/upload">
                    Try Analyzing
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute right-2 top-2 h-20 w-20 opacity-5">
                <FileText className="h-full w-full" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Reporting
                </CardTitle>
                <CardDescription>
                  Structured reporting with AI assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create reports with AI-suggested findings that you can approve or reject, and export as PDF. Integrate with your existing workflows and PACS systems.
                </p>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href="/dashboard">
                    See Examples
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="w-full bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto text-center max-w-[800px] space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Why Choose Scancer<span className="text-primary">AI</span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our platform is designed to integrate seamlessly into your clinical workflow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background">
              <CardHeader>
                <HeartPulse className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Improved Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI algorithms achieve high accuracy in detecting common pathologies, aiding in precise diagnostics.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader>
                <FileClock className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reduce reading time with AI-assisted workflows and automated findings detection, boosting efficiency.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share findings and collaborate with colleagues directly within the platform to improve patient care.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader>
                <Microscope className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">Research Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export anonymized data for research purposes and contribute to improving healthcare outcomes globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 md:py-24">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary p-8 md:p-12 shadow-lg">
            <div className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Ready to Transform Your Radiology Workflow?
                </h2>
                <p className="text-primary-foreground md:text-lg">
                  Join thousands of radiologists and clinicians who are using Scancer<span className="font-semibold">AI</span> to improve patient outcomes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" variant="default" className="bg-white hover:bg-white/90 text-primary" asChild>
                    <Link href="/upload" className="gap-2">
                      <Scan className="h-5 w-5" />
                      Try It Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    {/* Assuming a placeholder link or a future contact page */}
                    <a href="#contact-sales" className="gap-2">
                      <Users className="h-5 w-5" />
                      Contact Sales
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                {/* You can re-add an Image component here if you have a suitable dashboard preview image */}
                {/* Example:
                <div className="relative h-72 w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-black/20 z-10 rounded-lg" />
                  <Image 
                    src="/dashboard-preview.jpg" 
                    alt="Dashboard Preview" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                */}
                <div className="relative h-72 w-full overflow-hidden rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <BrainCircuit className="h-32 w-32 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 