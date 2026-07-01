import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unlockScreen, logout } from '../store/authSlice';

export const LockScreenOverlay = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.auth);
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(unlockScreen(password));
    };

    const handleSwitchUser = () => {
        dispatch(logout());
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="bg-surface p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 overflow-hidden border-4 border-surface shadow-sm">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-4xl text-primary">person</span>
                    )}
                </div>

                <h2 className="font-headline-md text-on-surface mb-1">{user?.name || 'Administrator'}</h2>
                <p className="font-body-sm text-on-surface-variant mb-6 text-center">
                    Sesi Anda dikunci karena tidak ada aktivitas. Masukkan kata sandi untuk melanjutkan.
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Kata Sandi..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-container rounded-lg px-4 py-3 font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                        {error && <p className="text-error text-xs mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="w-full bg-primary text-on-primary font-label-lg py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span className="material-symbols-outlined">lock_open</span>
                        )}
                        Buka Kunci
                    </button>
                </form>

                <button 
                    onClick={handleSwitchUser}
                    className="mt-6 text-sm text-primary font-medium hover:underline"
                >
                    Masuk dengan akun lain
                </button>
            </div>
        </div>
    );
};
