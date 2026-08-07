import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className || ""}`}
    >
      {children}
    </div>
  );
};
