import React from "react";
import { ORDER_STATUS_STEPS } from "@/constants/order";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: string;
}

export const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const isCancelled = status === "cancelled";
  const currentStep = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div className="py-8">
      <div className="relative flex justify-between">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        <div 
          className={cn(
            "absolute top-1/2 left-0 h-0.5 transition-all duration-1000 -translate-y-1/2 z-0",
            isCancelled ? "bg-red-500" : "bg-primary"
          )}
          style={{ 
            width: isCancelled 
              ? `${(currentStep === -1 ? 0 : (currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100)}%`
              : `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%` 
          }}
        />

        {ORDER_STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                  isCompleted 
                    ? "bg-primary border-primary text-black" 
                    : "bg-neutral-900 border-white/10 text-neutral-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
              </div>
              <span 
                className={cn(
                  "absolute -bottom-6 text-[8px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors",
                  isCompleted ? "text-white" : "text-neutral-600"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}

        {isCancelled && (
           <div className="relative z-10 flex flex-col items-center group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 border-red-500 text-white border-2">
                <X className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-6 text-[8px] uppercase tracking-widest font-bold whitespace-nowrap text-red-500">
                cancelled
              </span>
           </div>
        )}
      </div>
    </div>
  );
};
