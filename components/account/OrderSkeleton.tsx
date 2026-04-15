import React from "react";

export const OrderSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/5 rounded" />
            <div className="h-3 w-20 bg-white/5 rounded" />
          </div>
          <div className="h-8 w-24 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
};
