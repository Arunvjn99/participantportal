import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}> = ({ children, className = '', onClick, hoverEffect = false }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-premium border border-blue-50/50 p-6 
      ${hoverEffect ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition-all duration-300' : ''} 
      ${className}`}
  >
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "font-display font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-accent hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'teal' | 'orange' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Progress Bar ---
export const ProgressBar: React.FC<{ value: number; max?: number; color?: string }> = ({ value, max = 100, color = 'bg-accent' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
