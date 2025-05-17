"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  icon?: React.ReactNode;
}

export function FileInput({ 
  className, 
  onFilesSelected,
  label,
  icon,
  ...props 
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (fileList && onFilesSelected) {
      onFilesSelected(Array.from(fileList));
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && onFilesSelected) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleClick() {
    inputRef.current?.click();
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-sm transition-colors",
        dragActive ? "border-primary bg-primary/5" : "border-input hover:bg-muted/50",
        props.disabled ? "opacity-50 cursor-not-allowed" : "opacity-100",
        className
      )}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        className="absolute h-full w-full cursor-pointer opacity-0"
        onChange={handleChange}
        {...props}
      />
      <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center px-4">
        {icon || <UploadCloud className="h-10 w-10 text-muted-foreground" />}
        <div className="space-y-1">
          <p className="font-medium">
            {label || (
              <>
                <span className="text-primary">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {props.accept ? `Supported formats: ${props.accept}` : 'All file types supported'}
          </p>
        </div>
      </div>
    </div>
  );
} 