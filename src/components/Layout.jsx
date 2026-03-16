import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, LogOut, CheckSquare, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        sessionStorage.removeItem('slipscan_token');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-white to-blue-50 dark:from-white/5 dark:to-blue-900/10 shadow-2xl hidden md:flex flex-col border-r border-blue-100 dark:border-blue-800/30 transition-all duration-300">
                <div className="h-20 flex items-center px-8 border-b border-blue-100 dark:border-blue-800/30">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mr-3">
                        <CheckSquare className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SlipScan</span>
                </div>

                <nav className="flex-1 px-6 py-8 space-y-3">
                    <Link
                        to="/dashboard"
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/dashboard'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20 hover:scale-[1.01]'
                            }`}
                    >
                        <Home className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Dashboard</span>
                    </Link>

                    <Link
                        to="/upload"
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/upload'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20 hover:scale-[1.01]'
                            }`}
                    >
                        <Upload className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Upload Slip</span>
                    </Link>

                    <Link
                        to="/slips"
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/slips'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20 hover:scale-[1.01]'
                            }`}
                    >
                        <FileText className="h-6 w-6 mr-4" />
                        <span className="font-semibold">All Slips</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-blue-100 dark:border-blue-800/30 space-y-3">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full px-5 py-4 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                    >
                        <div className="flex items-center">
                            {theme === 'dark' ? <Sun className="h-6 w-6 mr-4 text-yellow-500" /> : <Moon className="h-6 w-6 mr-4" />}
                            <span className="font-semibold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                    >
                        <LogOut className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="h-20 bg-gradient-to-r from-white to-blue-50 dark:from-white/5 dark:to-blue-900/10 border-b border-blue-100 dark:border-blue-800/30 flex items-center justify-between px-6 md:hidden shadow-lg">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md mr-3">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SlipScan</span>
                    </div>
                    <button onClick={toggleTheme} className="p-3 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                        {theme === 'dark' ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6" />}
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-10 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 transition-colors duration-300 text-gray-900 dark:text-gray-100 relative z-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
