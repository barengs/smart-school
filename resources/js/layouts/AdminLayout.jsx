import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();

    // In a real app, this comes from the API (Matrix Menu)
    const menus = [
        { name: 'Dashboard', path: '/admin', icon: 'fa-solid fa-border-all' },
        { name: 'Students', path: '/admin/students', icon: 'fa-solid fa-users' },
        { name: 'Faculty', path: '/admin/faculty', icon: 'fa-solid fa-chalkboard-user' },
        { name: 'Courses', path: '/admin/courses', icon: 'fa-solid fa-book-open' },
        { name: 'Manajemen Berita', path: '/admin/news', icon: 'fa-solid fa-newspaper' },
        { name: 'Finance', path: '/admin/finance', icon: 'fa-solid fa-money-bill' },
        { name: 'Role Matrix', path: '/admin/rbac', icon: 'fa-solid fa-shield-halved' },
        { name: 'Reports', path: '/admin/reports', icon: 'fa-solid fa-chart-column' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-inter overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a192f] text-gray-300 flex flex-col justify-between flex-shrink-0 shadow-lg">
                <div>
                    <div className="h-20 flex items-center px-6 bg-[#081324] border-b border-gray-800">
                        <div className="w-8 h-8 bg-blue-100 text-blue-900 rounded flex items-center justify-center mr-3 font-bold">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight tracking-wide">Admin Portal</h2>
                            <p className="text-xs text-gray-400">Central Management</p>
                        </div>
                    </div>
                    
                    <div className="px-4 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Main Menu
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        {menus.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                                        isActive 
                                        ? 'bg-[#172a45] text-white border-l-4 border-blue-500' 
                                        : 'hover:bg-[#112240] hover:text-white border-l-4 border-transparent'
                                    }`}
                                >
                                    <i className={`${item.icon} w-6 text-center mr-3 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}></i>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="p-4">
                    <div className="bg-[#112240] rounded-md p-3 mb-4">
                        <div className="text-xs text-gray-400 text-center font-medium">Academic Year 2024</div>
                    </div>
                    <Link to="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#112240] transition-colors">
                        <i className="fa-solid fa-gear w-6 text-center mr-3 text-gray-400"></i> Settings
                    </Link>
                    <Link to="/admin/support" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#112240] transition-colors">
                        <i className="fa-solid fa-circle-question w-6 text-center mr-3 text-gray-400"></i> Support
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
                    <div className="flex-1 flex items-center">
                        <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                        <input type="text" placeholder="Cari data..." className="border-none focus:ring-0 outline-none w-full max-w-md text-sm" />
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-gray-600 relative">
                            <i className="fa-solid fa-bell text-lg"></i>
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="border-l border-gray-300 h-8"></div>
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full object-cover" src="https://ui-avatars.com/api/?name=Budi+Santoso&background=random" alt="User Avatar" />
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-700 leading-tight">Budi Santoso</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
