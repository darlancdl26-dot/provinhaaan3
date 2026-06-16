import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'ghost' | 'outline' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantMap = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border-transparent shadow-lg hover:shadow-blue-500/25',
  cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-transparent shadow-lg hover:shadow-cyan-500/25',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-transparent shadow-lg hover:shadow-purple-500/25',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border-transparent',
  outline: 'bg-transparent hover:bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
  danger: 'bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400',
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-cyan-500/40
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};
