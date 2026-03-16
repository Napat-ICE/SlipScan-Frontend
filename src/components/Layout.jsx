import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, LogOut, CheckSquare, Sun, Moon, FileText, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('slipscan_token');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`w-72 bg-white dark:bg-gray-800 shadow-2xl flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 fixed md:relative h-full ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
                <div className="h-20 flex items-center px-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg mr-3">
                        <CheckSquare className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">SlipScan</span>
                </div>

                <nav className="flex-1 px-6 py-8 space-y-3">
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/dashboard'
                            ? 'bg-blue-500 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.01]'
                            }`}
                    >
                        <Home className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Dashboard</span>
                    </Link>

                    <Link
                        to="/upload"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/upload'
                            ? 'bg-blue-500 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.01]'
                            }`}
                    >
                        <Upload className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Upload Slip</span>
                    </Link>

                    <Link
                        to="/slips"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${location.pathname === '/slips'
                            ? 'bg-blue-500 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:scale-[1.01]'
                            }`}
                    >
                        <FileText className="h-6 w-6 mr-4" />
                        <span className="font-semibold">All Slips</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full px-5 py-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                    >
                        <div className="flex items-center">
                            {theme === 'dark' ? <Sun className="h-6 w-6 mr-4 text-yellow-500" /> : <Moon className="h-6 w-6 mr-4" />}
                            <span className="font-semibold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                    >
                        <LogOut className="h-6 w-6 mr-4" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 md:hidden shadow-lg">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 mr-3"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <div className="h-8 w-8 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md mr-3">
                            <CheckSquare className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-gray-900 dark:text-white">SlipScan</span>
                    </div>
                    <button onClick={toggleTheme} className="p-3 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                        {theme === 'dark' ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6" />}
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-10 bg-white dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100 relative z-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
