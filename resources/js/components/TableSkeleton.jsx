import React from 'react';

export const TableSkeleton = () => (
    <div className="animate-pulse flex flex-col gap-4 w-full mt-4">
        <div className="h-10 bg-surface-variant/50 rounded-lg w-1/4 mb-4"></div>
        <div className="h-64 bg-surface-variant/30 rounded-xl border border-outline-variant/30"></div>
    </div>
);
