import React from 'react';

const appIconImgUrl = new URL('../../assets/images/gotatracker_app_icon_1785023036464.jpg', import.meta.url).href;

interface AppIconProps {
  className?: string;
  size?: number;
  useImage?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = '', size = 32, useImage = false }) => {
  if (useImage) {
    return (
      <img
        src={appIconImgUrl}
        alt="GotaTracker Icon"
        style={{ width: size, height: size }}
        className={`rounded-xl object-contain shadow-xs ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <defs>
        <linearGradient id="gotaDropGradient" x1="16" y1="4" x2="48" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>

      {/* Main Droplet Shape */}
      <path
        d="M32 4C32 4 8 28 8 42C8 54 18.7 60 32 60C45.3 60 56 54 56 42C56 28 32 4 32 4Z"
        fill="url(#gotaDropGradient)"
      />

      {/* Bold 'G' letter in center */}
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="32"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        style={{ letterSpacing: '-1px' }}
      >
        G
      </text>

      {/* Glossy reflection crescent on bottom right */}
      <path
        d="M48 44C47.5 50.5 41 54.5 35 55C42 54 48 48 46.5 41.5Z"
        fill="#FFFFFF"
        opacity="0.85"
      />
    </svg>
  );
};
