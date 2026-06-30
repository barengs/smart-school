import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <>
            {/* TopNavBar */}
            <header className="w-full top-0 sticky bg-surface border-b border-outline-variant z-50">
                <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Academia SIS</Link>
                    </div>
                    {/* Web Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Beranda</Link>
                        <Link to="/profile" className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Profil Sekolah</Link>
                        <Link to="/news" className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Berita</Link>
                        <Link to="/info-ppdb" className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Info PPDB</Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-4">
                        <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                        <Link to="/login" className="font-label-md text-label-md font-bold px-4 py-2 border border-primary text-primary rounded hover:bg-surface-container transition-colors inline-block">Masuk</Link>
                        <Link to="/form-ppdb" className="font-label-md text-label-md font-bold px-4 py-2 bg-[#fbbf24] text-[#1e3a8a] rounded hover:bg-[#f59e0b] transition-colors inline-block">Daftar Sekarang</Link>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-on-surface-variant">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full py-stack-lg bg-surface-container-highest border-t border-outline-variant mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full gap-stack-md">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-headline-md text-headline-md font-bold text-primary">Academia SIS</span>
                        <span className="text-on-background font-body-sm text-body-sm mt-2">© 2024 Academia SIS. Hak Cipta Dilindungi.</span>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Kebijakan Privasi</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Syarat & Ketentuan</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Aksesibilitas</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Hubungi Kami</a>
                    </nav>
                </div>
            </footer>
        </>
    );
};

export default PublicLayout;
