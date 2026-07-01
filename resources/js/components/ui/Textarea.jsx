import React from 'react';

export const Textarea = React.forwardRef(({ className = '', error, label, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="font-label-md text-label-md text-on-surface">
                    {label} {props.required && <span className="text-error">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                className={`w-full border bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors ${
                    error ? 'border-error' : 'border-outline/30 dark:border-outline-variant/40'
                } ${className}`}
                {...props}
            />
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    );
});

Textarea.displayName = 'Textarea';
