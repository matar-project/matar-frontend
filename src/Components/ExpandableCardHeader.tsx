import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

interface ExpandableCardHeaderProps {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function ExpandableCardHeader({
  children,
  expanded,
  onToggle,
  className,
}: ExpandableCardHeaderProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-start justify-between gap-4 p-5 text-right transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500",
        className,
      )}
      onClick={onToggle}
      aria-expanded={expanded}
    >
      {children}
      <span className="mt-1 shrink-0 rounded-lg bg-gray-100 p-2 text-gray-600">
        {expanded ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
