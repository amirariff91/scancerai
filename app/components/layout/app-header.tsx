import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  LayoutDashboard, 
  FileUp, 
  BarChart, 
  PlusCircle, 
  Menu 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { CornerstoneBadge } from "@/app/components/dicom-viewer/cornerstone-badge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              S
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Scancer<span className="text-primary">AI</span>
            </span>
          </Link>
          <CornerstoneBadge className="ml-4 hidden md:flex" />
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/studies" 
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <BarChart className="h-4 w-4" />
            Studies
          </Link>
          <Link 
            href="/upload" 
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <FileUp className="h-4 w-4" />
            Upload
          </Link>
          <Button size="sm" variant="default" asChild>
            <Link href="/upload" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Scan
            </Link>
          </Button>
        </nav>
        
        {/* Mobile navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="mt-6 space-y-1">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/studies" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <BarChart className="h-4 w-4" />
                  Studies
                </Link>
                <Link 
                  href="/upload" 
                  className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <FileUp className="h-4 w-4" />
                  Upload
                </Link>
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" className="w-full gap-2" asChild>
                    <Link href="/upload">
                      <PlusCircle className="h-4 w-4" />
                      New Scan
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 