import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenus, fetchSchoolProfile } from '../../../store/publicSlice';

const PublicLayoutModern = () => {
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
    const schoolLogo = profile?.logo_path ? `/storage/${profile.logo_path}` : null;
    const currentYear = new Date().getFullYear();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="antialiased overflow-x-hidden font-sans bg-[#f7f9fb]">
            {/* TopNavBar */}
            <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant">
                <div className="flex justify-between items-center w-full px-4 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            {schoolLogo ? (
                                <img src={schoolLogo} alt="Logo" className="h-10 object-contain" />
                            ) : (
                                <span className="material-symbols-outlined text-primary text-4xl">school</span>
                            )}
                            <span className="font-headline-lg text-headline-lg font-bold text-primary">
                                {schoolName}
                            </span>
                        </Link>
                    </div>
                    
                    <nav className="hidden xl:flex gap-4 lg:gap-8 items-center">
                        {menus.map(item => (
                            <Link key={item.id} to={item.url} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200 whitespace-nowrap">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">notifications</span>
                            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">help_outline</span>
                        </div>
                        <Link to="/form-ppdb" className="hidden lg:block px-6 py-2 bg-secondary text-on-secondary font-label-md rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
                            Daftar Sekarang
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/admin" className="px-6 py-2 border border-primary text-primary font-label-md rounded-full hover:bg-primary/5 transition-colors whitespace-nowrap">
                                Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="px-6 py-2 border border-primary text-primary font-label-md rounded-full hover:bg-primary/5 transition-colors whitespace-nowrap">
                                Login
                            </Link>
                        )}
                        <button 
                            className="xl:hidden text-on-surface-variant ml-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="xl:hidden bg-surface border-t border-outline-variant py-4 px-margin-mobile flex flex-col gap-4 shadow-lg">
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
                            <Link to="/form-ppdb" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-6 py-2 bg-secondary text-on-secondary font-label-md rounded-full hover:opacity-90">
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow min-h-screen">
                <Outlet context={{ profile, menus }} />
            </main>

            {/* Footer */}
            <footer className="bg-primary pt-20 pb-10 text-white">
                <div className="w-full px-margin-desktop max-w-container-max mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-lg mb-16">
                        {/* Branding & About */}
                        <div className="lg:col-span-1">
                            <span className="font-headline-lg text-headline-lg font-bold text-white mb-6 block">{schoolName}</span>
                            {profile?.about_text ? (
                                <div 
                                    className="font-body-sm text-on-primary-container leading-relaxed mb-6 line-clamp-4 prose-sm prose-invert"
                                    dangerouslySetInnerHTML={{ __html: profile.about_text }}
                                />
                            ) : (
                                <p className="font-body-sm text-on-primary-container leading-relaxed mb-6">
                                    Sekolah Information System (SIS) terintegrasi yang berkomitmen untuk memberikan pendidikan terbaik berbasis nilai-nilai Islami dan kemajuan teknologi terkini.
                                </p>
                            )}
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">public</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-headline-md mb-6">Tautan Cepat</h4>
                            <ul className="space-y-4 font-body-md text-on-primary-container">
                                {menus.map(item => (
                                    <li key={item.id}>
                                        <Link to={item.url} className="hover:text-secondary-container transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-headline-md mb-6">Sumber Daya</h4>
                            <ul className="space-y-4 font-body-md text-on-primary-container">
                                <li><Link to="/info-ppdb" className="hover:text-secondary-container transition-colors">Penerimaan Siswa</Link></li>
                                <li><a href="#" className="hover:text-secondary-container transition-colors">Portal Orang Tua</a></li>
                                <li><a href="#" className="hover:text-secondary-container transition-colors">Portal Siswa</a></li>
                                <li><a href="#" className="hover:text-secondary-container transition-colors">Kalender Akademik</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-headline-md mb-6">Kontak Kami</h4>
                            <ul className="space-y-4 font-body-md text-on-primary-container">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-secondary-container">location_on</span>
                                    {profile?.address || 'Alamat Belum Diatur'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary-container">call</span>
                                    {profile?.phone || 'Telepon Belum Diatur'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary-container">mail</span>
                                    {profile?.email || 'Email Belum Diatur'}
                                </li>
                            </ul>
                            <div className="mt-8">
                                <h5 className="font-label-md mb-3 uppercase tracking-wider">Langganan Newsletter</h5>
                                <div className="flex">
                                    <input className="bg-white/10 border-white/20 rounded-l-lg px-4 py-2 w-full text-white placeholder-white/50 focus:outline-none" placeholder="Email Anda" type="email" />
                                    <button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-r-lg font-bold">Daftar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-on-primary-container font-body-sm">
                        <p>© {currentYear} {schoolName}. Seluruh Hak Cipta Dilindungi.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-white">Aksesibilitas</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayoutModern;
