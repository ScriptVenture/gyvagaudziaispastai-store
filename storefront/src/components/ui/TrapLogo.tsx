import React from 'react';

interface TrapLogoProps {
  className?: string;
}

const TrapLogo: React.FC<TrapLogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main trap cage structure */}
      <rect
        x="2"
        y="8"
        width="20"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      
      {/* Vertical bars of the trap - evenly spaced */}
      <line x1="5" y1="8" x2="5" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <line x1="8" y1="8" x2="8" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <line x1="11" y1="8" x2="11" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <line x1="13" y1="8" x2="13" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <line x1="16" y1="8" x2="16" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      <line x1="19" y1="8" x2="19" y2="19" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
      
      {/* Trap door mechanism - more refined */}
      <path
        d="M2 8 L6 4 L18 4 L22 8"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.05)"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      
      {/* Handle on top */}
      <rect
        x="10.5"
        y="2"
        width="3"
        height="1.5"
        rx="0.75"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Professional looking animal silhouette inside */}
      <ellipse
        cx="12"
        cy="13.5"
        rx="2.5"
        ry="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      
      {/* Small details for professionalism */}
      <circle cx="4" cy="13.5" r="0.5" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="13.5" r="0.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
};

export default TrapLogo;