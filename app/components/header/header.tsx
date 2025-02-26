import Link from "next/link";
import Image from "next/image";

import { Button } from "@/app/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/next.svg"
              alt="Next.js Logo"
              width={90}
              height={18}
              priority
              className="dark:invert"
            />
            <span className="hidden text-lg font-semibold sm:inline-block">
              ScannerAI Demo
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Button size="sm" asChild>
            <Link href="https://nextjs.org/docs" target="_blank">
              Docs
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
} 