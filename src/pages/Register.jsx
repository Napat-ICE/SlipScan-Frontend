import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Redirect if already logged in
        if (sessionStorage.getItem('slipscan_token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!email || !password) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (password.length < 8) {
            setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/auth/register', { email, password });

            if (response.data.success) {
                setSuccessMsg('สมัครสมาชิกสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(response.data.message || 'ไม่สามารถสมัครสมาชิกได้ โปรดลองอีกครั้ง');
            }
        } catch (err) {
            // Handle array of errors if sent by express-validator
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                setError(err.response.data.errors[0].msg);
            } else {
                setError(err.response?.data?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 transition-colors duration-300">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={toggleTheme} className="p-3 text-gray-500 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-white/10">
                    {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 dark:bg-white/5 dark:backdrop-blur-xl p-10 shadow-2xl border border-white/20 dark:border-white/10 transition-all duration-300 hover:shadow-3xl">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                            S
                        </div>
                    </div>
                    <h2 className="mt-4 text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Sign Up</h2>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-400 font-medium">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>
                </div>

                {error && (
                    <div className="bg-red-50/80 dark:bg-red-900/40 border border-red-200/50 dark:border-red-500/40 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-pulse">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-50/80 dark:bg-green-900/40 border border-green-200/50 dark:border-green-800/40 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-pulse">
                        {successMsg}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                อีเมล
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full appearance-none rounded-xl border border-gray-300/50 dark:border-white/20 bg-white/60 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500/70 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 sm:text-sm shadow-sm transition-all duration-300 hover:border-gray-400/50 dark:hover:border-white/30"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รหัสผ่าน
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="block w-full appearance-none rounded-xl border border-gray-300/50 dark:border-white/20 bg-white/60 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500/70 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 sm:text-sm shadow-sm transition-all duration-300 hover:border-gray-400/50 dark:hover:border-white/30"
                                placeholder="อย่างน้อย 8 ตัวอักษร"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ยืนยันรหัสผ่าน
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="block w-full appearance-none rounded-xl border border-gray-300/50 dark:border-white/20 bg-white/60 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500/70 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 sm:text-sm shadow-sm transition-all duration-300 hover:border-gray-400/50 dark:hover:border-white/30"
                                placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || successMsg}
                            className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 py-3 px-4 text-sm font-semibold text-white hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 disabled:cursor-not-allowed shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin rounded-full border-2 border-white dark:border-gray-200 border-t-transparent h-4 w-4 mr-2"></span>
                                    กำลังสมัครสมาชิก...
                                </>
                            ) : (
                                'สมัครสมาชิก'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link to="/" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300 hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
