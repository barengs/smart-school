import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchMenus, fetchSchoolProfile } from '../../../store/publicSlice';

const PublicLayoutDefault = () => {
    const dispatch = useDispatch();
    const { menus, profile, initializedMenus, initializedProfile } = useSelector(state => state.public);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (!initializedMenus) {
            dispatch(fetchMenus());
        }
        if (!initializedProfile) {
            dispatch(fetchSchoolProfile());
        }
    }, [dispatch, initializedMenus, initializedProfile]);

    const schoolName = profile?.name || 'Academia SIS';
    const schoolLogo = profile?.logo ? `/storage/${profile.logo}` : null;
    const currentYear = new Date().getFullYear();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <>
            {/* TopNavBar */}
            <header className="w-full top-0 sticky bg-surface border-b border-outline-variant z-50">
                <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            {schoolLogo ? (
                                <img src={schoolLogo} alt="Logo" className="w-12 h-12 object-contain" />
                            ) : (
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>school</span>
                            )}
                            <span className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary">
                                {schoolName}
                            </span>
                        </Link>
                    </div>
                    {/* Web Nav Links */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {menus.map(item => (
                            <Link key={item.id} to={item.url} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="hidden lg:flex items-center gap-4">
                        <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                        {isAuthenticated ? (
                            <Link to="/admin" className="font-label-md text-label-md font-bold px-4 py-2 border border-primary text-primary rounded hover:bg-surface-container transition-colors inline-block">Dashboard</Link>
                        ) : (
                            <Link to="/login" className="font-label-md text-label-md font-bold px-4 py-2 border border-primary text-primary rounded hover:bg-surface-container transition-colors inline-block">Masuk</Link>
                        )}
                        <Link to="/form-ppdb" className="font-label-md text-label-md font-bold px-4 py-2 bg-[#fbbf24] text-[#1e3a8a] rounded hover:bg-[#f59e0b] transition-colors inline-block">Daftar Sekarang</Link>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button 
                        className="lg:hidden text-on-surface-variant"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
                
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-surface border-t border-outline-variant py-4 px-margin-mobile flex flex-col gap-4">
                        <nav className="flex flex-col gap-4">
                            {menus.map(item => (
                                <Link 
                                    key={item.id} 
                                    to={item.url} 
                                    className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-outline-variant">
                            {isAuthenticated ? (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-label-md text-label-md font-bold px-4 py-2 border border-primary text-primary rounded hover:bg-surface-container transition-colors text-center">Dashboard</Link>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-label-md text-label-md font-bold px-4 py-2 border border-primary text-primary rounded hover:bg-surface-container transition-colors text-center">Masuk</Link>
                            )}
                            <Link to="/form-ppdb" onClick={() => setIsMobileMenuOpen(false)} className="font-label-md text-label-md font-bold px-4 py-2 bg-[#fbbf24] text-[#1e3a8a] rounded hover:bg-[#f59e0b] transition-colors text-center">Daftar Sekarang</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet context={{ profile, menus }} />
            </main>

            {/* Footer */}
            <footer className="w-full py-stack-lg bg-surface-container-highest border-t border-outline-variant mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full gap-stack-md">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-2">
                            {schoolLogo ? (
                                <img src={schoolLogo} alt="Logo" className="w-10 h-10 object-contain grayscale opacity-70" />
                            ) : (
                                <span className="material-symbols-outlined text-on-background" style={{ fontSize: '32px' }}>school</span>
                            )}
                            <span className="font-headline-md text-headline-md font-bold text-primary">{schoolName}</span>
                        </div>
                        <span className="text-on-background font-body-sm text-body-sm mt-1 text-center md:text-left">© {currentYear} {schoolName}. Hak Cipta Dilindungi.</span>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Kebijakan Privasi</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Syarat & Ketentuan</a>
                        <a className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded" href="#">Aksesibilitas</a>
                        <Link to="/contact" className="text-on-surface-variant font-label-md text-label-md hover:underline transition-all focus:ring-2 focus:ring-primary rounded">Hubungi Kami</Link>
                    </nav>
                </div>
            </footer>
        </>
    );
};

export default PublicLayoutDefault;
