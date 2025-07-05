import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-6 sm:p-8 transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-primary/10 ${className}`}>
      {children}
    </div>
  );
};