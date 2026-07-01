import React from 'react';

export const Card = ({ children, className = '', title, headerAction, footer }) => {
    return (
        <div className={`bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm ${className}`}>
            {(title || headerAction) && (
                <div className="p-4 border-b border-outline-variant flex justify-between items-center gap-4">
                    {title && <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{title}</h2>}
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
            {footer && (
                <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
                    {footer}
                </div>
            )}
        </div>
    );
};
