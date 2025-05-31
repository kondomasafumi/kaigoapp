import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-blue-500"></div>
    </div>
  );
};