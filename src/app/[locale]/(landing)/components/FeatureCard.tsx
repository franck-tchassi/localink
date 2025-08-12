// components/FeatureCard.tsx
import React from "react";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeatureCard({ children, className = "" }: FeatureCardProps) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}