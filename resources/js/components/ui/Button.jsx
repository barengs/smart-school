import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    href, 
    to, 
    type = 'button',
    ...props 
}) => {
    const baseStyle = "inline-flex items-center justify-center font-label-md font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-primary text-on-primary hover:bg-primary/90",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
        danger: "bg-error text-on-error hover:bg-error/90",
        outline: "border border-outline text-on-surface hover:bg-surface-container",
        text: "text-primary hover:bg-primary/10"
    };
    
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-md",
        lg: "px-6 py-3 text-lg"
    };

    const combinedClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={combinedClassName} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={combinedClassName} {...props}>
            {children}
        </button>
    );
};
