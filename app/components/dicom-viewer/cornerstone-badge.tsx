import React from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Info as InfoIcon } from 'lucide-react';
import Link from 'next/link';

interface CornerstoneBadgeProps {
  className?: string;
}

export function CornerstoneBadge({ className }: CornerstoneBadgeProps) {
  return (
    <Link href="/studies" className={className}>
      <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
        <InfoIcon className="h-3 w-3" />
        <span>New DICOM Viewer Available</span>
      </Badge>
    </Link>
  );
}

export default CornerstoneBadge; 