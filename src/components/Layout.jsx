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
        <div className="flex h-screen bg-gray-50 dark:bg-transparent overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-white/5 dark:backdrop-blur-lg shadow-md hidden md:flex flex-col border-r border-gray-100 dark:border-white/10 transition-colors duration-200">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/10">
                    <CheckSquare className="h-8 w-8 text-blue-600 dark:text-blue-500 mr-2" />
                    <span className="text-xl font-bold text-gray-800 dark:text-white">SlipScan</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        to="/dashboard"
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard'
                            ? 'bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                            }`}
                    >
                        <Home className="h-5 w-5 mr-3" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/upload"
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/upload'
                            ? 'bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                            }`}
                    >
                        <Upload className="h-5 w-5 mr-3" />
                        <span className="font-medium">Upload Slip</span>
                    </Link>

                    <Link
                        to="/slips"
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === '/slips'
                            ? 'bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                            }`}
                    >
                        <FileText className="h-5 w-5 mr-3" />
                        <span className="font-medium">All Slips</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-white/10 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <div className="flex items-center">
                            {theme === 'dark' ? <Sun className="h-5 w-5 mr-3 text-yellow-500" /> : <Moon className="h-5 w-5 mr-3" />}
                            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white dark:bg-white/5 dark:backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-between px-4 md:hidden">
                    <div className="flex items-center">
                        <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-lg font-bold text-gray-800 dark:text-white">SlipScan</span>
                    </div>
                    <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-white/10">
                        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50 dark:bg-transparent transition-colors duration-200 text-gray-900 dark:text-gray-100 relative z-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
