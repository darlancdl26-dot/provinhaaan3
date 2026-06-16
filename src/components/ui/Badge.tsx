import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'blue' | 'slate' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

const variantMap = {
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  slate: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full border
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
