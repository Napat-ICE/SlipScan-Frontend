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
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-transparent transition-colors duration-200">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                    {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-white/5 dark:backdrop-blur-xl p-10 shadow-lg border border-gray-100 dark:border-white/10 transition-colors duration-200">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                            S
                        </div>
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">Sign Up</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 px-4 py-3 rounded-md text-sm backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm">
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
                                className="block w-full appearance-none rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm shadow-sm transition-colors"
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
                                className="block w-full appearance-none rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm shadow-sm transition-colors"
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
                                className="block w-full appearance-none rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm shadow-sm transition-colors"
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
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed shadow-sm transition-colors"
                        >
                            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link to="/" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
