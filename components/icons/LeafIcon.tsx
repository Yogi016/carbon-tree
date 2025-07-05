
import React from 'react';

export const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 20A7 7 0 0 1 4 13V8a8 8 0 0 1 16 0v5a7 7 0 0 1-7 7h-1Z" />
    <path d="M11 20v-9" />
  </svg>
);
