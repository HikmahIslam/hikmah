import React from 'react';

/**
 * Modern Islamic Logo Icon - Royal Emerald & Champagne Gold Theme
 */
export const HikmahIcon = ({ className = "w-6 h-6", ...props }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        {/* Metallic Emerald & Gold Foil Gradient */}
        <linearGradient id="emeraldGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Luminous Emerald Radial Aura */}
        <radialGradient id="emeraldAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#047857" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#022C22" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luminous Emerald Aura */}
      <circle cx="50" cy="50" r="44" fill="url(#emeraldAura)" />

      {/* Rub el Hizb Outer Geometry (Interlocking Dual Squares) */}
      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        rx="10"
        stroke="url(#emeraldGoldGrad)"
        strokeWidth="2.2"
        strokeOpacity="0.6"
        fill="none"
      />
      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        rx="10"
        transform="rotate(45 50 50)"
        stroke="url(#emeraldGoldGrad)"
        strokeWidth="2.2"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* Outer 8-Pointed Star Contour Line */}
      <path
        d="
          M 50 6 
          L 61.5 17.5 
          L 78 10.5 
          L 78 27 
          L 94 38.5 
          L 84 50 
          L 94 61.5 
          L 78 73 
          L 78 89.5 
          L 61.5 82.5 
          L 50 94 
          L 38.5 82.5 
          L 22 89.5 
          L 22 73 
          L 6 61.5 
          L 16 50 
          L 6 38.5 
          L 22 27 
          L 22 10.5 
          L 38.5 17.5 
          Z
        "
        stroke="url(#emeraldGoldGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Central Mihrab Arch Backdrop */}
      <path
        d="M 33 67 V 46 C 33 34, 50 25, 50 25 C 50 25, 67 34, 67 46 V 67 Z"
        fill="url(#emeraldGoldGrad)"
        fillOpacity="0.25"
        stroke="url(#emeraldGoldGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      {/* Modern Crescent Moon */}
      <path
        d="M 55 35 C 45.5 35 38 42.5 38 52 C 38 61.5 45.5 69 55 69 C 50.5 66.8 46.5 60.5 46.5 52 C 46.5 43.5 50.5 37.2 55 35 Z"
        fill="url(#emeraldGoldGrad)"
      />

      {/* Floating 8-Point Star Symbol */}
      <g transform="translate(60, 42) scale(0.18)">
        <path
          d="M25 0 L31.5 18.5 L50 25 L31.5 31.5 L25 50 L18.5 31.5 L0 25 L18.5 18.5 Z"
          fill="#FEF08A"
        />
        <path
          d="M25 0 L31.5 18.5 L50 25 L31.5 31.5 L25 50 L18.5 31.5 L0 25 L18.5 18.5 Z"
          transform="rotate(45 25 25)"
          fill="#10B981"
        />
      </g>
    </svg>
  );
};

export default HikmahIcon;
