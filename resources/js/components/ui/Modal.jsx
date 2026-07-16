import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-outline-variant">
                    <h2 className="font-headline-sm text-on-surface">{title}</h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-variant/50 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined icon-fill">close</span>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
