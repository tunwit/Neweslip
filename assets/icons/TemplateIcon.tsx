import React from "react";

interface TemplateIconProps {
  className?: string;
}
export default function TemplateIcon({ className }: TemplateIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="M22 2H2v6h20zm0 8H11v12h11zM9 22V10H2v12z"
      ></path>
    </svg>
  );
}
