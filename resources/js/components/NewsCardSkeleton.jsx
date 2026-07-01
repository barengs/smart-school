import React from 'react';

export const NewsCardSkeleton = () => {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-surface-container-high border-b border-outline-variant"></div>
            
            {/* Content Placeholder */}
            <div className="p-stack-md flex flex-col gap-stack-sm h-[200px] bg-surface-container-lowest z-10 relative">
                {/* Date */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-surface-container-high rounded-sm"></div>
                    <div className="w-24 h-4 bg-surface-container-high rounded-md"></div>
                </div>
                
                {/* Title (2 lines) */}
                <div className="w-full h-6 bg-surface-container-high rounded-md mt-1"></div>
                <div className="w-3/4 h-6 bg-surface-container-high rounded-md"></div>
                
                {/* Excerpt (3 lines) */}
                <div className="w-full h-4 bg-surface-container-high rounded-md mt-2"></div>
                <div className="w-full h-4 bg-surface-container-high rounded-md"></div>
                <div className="w-2/3 h-4 bg-surface-container-high rounded-md"></div>
            </div>
        </div>
    );
};
