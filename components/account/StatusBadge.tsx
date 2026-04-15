import React from "react";
import { STATUS_MAP } from "@/constants/order";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;
  
  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ring-1 ring-inset",
      config.color,
      config.bg,
      "ring-current/20",
      className
    )}>
      {config.label}
    </div>
  );
};
