import React from 'react';

export const Button = ({ children, className, variant = 'default', size = 'md', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg' }) => {
  const baseClass = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variantClass = variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90';
  const sizeClass = size === 'sm' ? 'h-9 rounded-md px-3' : size === 'lg' ? 'h-11 rounded-md px-8' : 'h-10 px-4 py-2';
  
  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
