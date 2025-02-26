"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { Plus, Minus } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoButtonProps {
  className?: string;
}

export function DemoButton({ className }: DemoButtonProps) {
  // Local state example
  const [count, setCount] = useState(0);
  
  // URL search parameter state using nuqs
  const [theme, setTheme] = useQueryState("theme", {
    defaultValue: "light",
    history: "push",
  });
  
  // Get the search params to read them manually if needed
  const searchParams = useSearchParams();
  
  function incrementCount() {
    setCount((prev) => prev + 1);
  }
  
  function decrementCount() {
    setCount((prev) => Math.max(0, prev - 1));
  }
  
  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={decrementCount}>
          <Minus size={16} />
        </Button>
        <span className="min-w-10 text-center">{count}</span>
        <Button variant="outline" size="icon" onClick={incrementCount}>
          <Plus size={16} />
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 items-center">
        <Button
          onClick={toggleTheme}
          variant="secondary"
        >
          Toggle Theme: {theme}
        </Button>
        <p className="text-xs text-muted-foreground">
          Check the URL, it updates with the theme parameter!
        </p>
      </div>
    </div>
  );
} 