import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ActivityMonitor } from '../components/ActivityMonitor';
import { LockScreenOverlay } from '../components/LockScreenOverlay';
import axios from 'axios';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLocked, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const [menus, setMenus] = React.useState([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('/menus?type=admin').then(res => {
                setMenus(res.data);
            }).catch(err => {
                console.error("Failed to load admin menus", err);
            });
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <div className={`bg-background text-on-background font-body-md text-body-md antialiased flex h-screen overflow-hidden ${isLocked ? 'blur-sm pointer-events-none' : ''}`}>
            {/* Monitor and LockScreen are mounted outside the blurred container */}
            <ActivityMonitor />
            {/* Shared Component: SideNavBar */}
            <aside className={`fixed left-0 top-0 h-screen ${isSidebarCollapsed ? 'w-20' : 'w-sidebar-width'} bg-primary text-on-primary flex flex-col z-50 transition-all duration-300`}>
                {/* Header */}
                <div className={`flex items-center border-b border-white/10 h-16 shrink-0 ${isSidebarCollapsed ? 'justify-center p-0' : 'p-gutter justify-between'}`}>
                    <div className={`flex items-center overflow-hidden ${isSidebarCollapsed ? 'justify-center' : 'gap-stack-md'}`}>
                        <div className="w-12 h-12 flex items-center justify-center text-secondary-fixed font-bold shrink-0">
                            <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>school</span>
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="whitespace-nowrap transition-opacity duration-300">
                                <h1 className="font-headline-md text-headline-md text-secondary-fixed">Admin Portal</h1>
                                <p className="font-body-sm text-body-sm text-on-primary/70">Central Management</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-stack-md flex flex-col gap-1">
                    {menus.map((item) => {
                        const isActive = location.pathname === item.url || (item.url !== '/admin' && location.pathname.startsWith(item.url));
                        return (
                            <Link
                                key={item.id || item.label}
                                to={item.url}
                                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-stack-md px-stack-md'} py-stack-sm transition-all duration-200 ${
                                    isActive
                                        ? 'border-l-4 border-secondary-fixed bg-white/10 text-on-primary font-bold'
                                        : 'border-l-4 border-transparent text-on-primary/70 hover:bg-white/5 hover:text-on-primary'
                                }`}
                                title={isSidebarCollapsed ? item.label : ''}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''}`}>{item.icon || 'circle'}</span>
                                {!isSidebarCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / CTA */}
                <div className="p-stack-md border-t border-white/10 flex flex-col gap-2 shrink-0 overflow-hidden">
                    {!isSidebarCollapsed && (
                        <div className="px-stack-sm py-2 bg-primary-container text-on-primary-container rounded font-label-md text-label-md text-center mb-2 whitespace-nowrap">
                            Academic Year 2024
                        </div>
                    )}

                    <Link to="/admin/support" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-stack-md px-stack-md'} py-stack-sm text-on-primary/70 hover:bg-white/5 hover:text-on-primary transition-all duration-200`} title={isSidebarCollapsed ? 'Support' : ''}>
                        <span className="material-symbols-outlined">contact_support</span>
                        {!isSidebarCollapsed && <span className="font-label-md text-label-md whitespace-nowrap">Support</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-sidebar-width'} flex-1 flex flex-col h-screen overflow-hidden bg-surface transition-all duration-300`}>
                {/* Admin Top Bar */}
                <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-gutter shrink-0">
                    <div className="flex items-center gap-stack-md text-on-surface-variant">
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Cari data..." className="bg-transparent border-none focus:ring-0 font-body-sm text-body-sm text-on-surface w-64 placeholder:text-on-surface-variant" />
                    </div>
                    <div className="flex items-center gap-gutter">
                        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-stack-md border-l border-outline-variant pl-gutter">
                            <div className="flex items-center gap-stack-sm">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0FHxqKbpMXizZA4gQf8mB5cND6Xc01a_fYxyfJVLWs9AS31-caDi-Z95bpK8gXl1fmfm_BOsns8QzxRWBk8EjDnW-R70CqFzCltC7yUub1NHfadJ2nDhLqwOKI_oGJMeFVTqGoKMnu8J9fWabu9N9QhY0hdYLOPVKiIHT3CXLx7nAhjLVwF4w1adfw6KKya0KneUDJqFZCyzL7nosD_yC9TWH7tarW9a0ZI241AVp0QZZO0KNzW0yg2walOTkBXYc84OrI34xuos" alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-on-surface">Super Admin</span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant" style={{ fontSize: '11px', lineHeight: '14px' }}>Sistem Utama</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-error hover:bg-error/10 p-2 rounded-full transition-colors ml-2" title="Keluar">
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <Outlet />
                    </div>
                </main>
            </div>
            {isLocked && <LockScreenOverlay />}
        </>
    );
};

export default AdminLayout;
