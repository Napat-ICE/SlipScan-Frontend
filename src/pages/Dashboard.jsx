import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, AlertTriangle, TrendingUp, BarChart3, Clock, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_slips: 0,
        total_amount: 0,
        fake_count: 0,
        dup_count: 0
    });
    const [recentSlips, setRecentSlips] = useState([]);
    const [bankRanking, setBankRanking] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [allTrendData, setAllTrendData] = useState({ daily: [], weekly: [], monthly: [] });
    const [chartMode, setChartMode] = useState('daily');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const token = sessionStorage.getItem('slipscan_token');
        if (!token) {
            navigate('/');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const dashboardRes = await api.get('/api/slips/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (dashboardRes.data.success) {
                    const data = dashboardRes.data;
                    setStats(data.summary);
                    setBankRanking(data.bank_ranking);
                    setAllTrendData({
                        daily: data.daily_trend,
                        weekly: data.weekly_summary,
                        monthly: data.monthly_summary
                    });
                    setTrendData(data.daily_trend); // Default to daily
                    setRecentSlips(data.recent_slips);
                }
            } catch (err) {
                console.error(err);
                setError('ไม่สามารถโหลดข้อมูล Dashboard ได้');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleChartModeChange = (mode) => {
        setChartMode(mode);
        if (mode === 'daily') setTrendData(allTrendData.daily);
        else if (mode === 'weekly') setTrendData(allTrendData.weekly);
        else if (mode === 'monthly') setTrendData(allTrendData.monthly);
    };

    const formatMoney = (amount) => {
        return Number(amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (dateString, mode = 'full') => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (mode === 'short') {
            return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleString('th-TH');
    };

    const COLORS = ['#4f46e5', '#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#cbd5e1', '#94a3b8'];
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        color: theme === 'dark' ? '#f9fafb' : '#111827',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                    <span className="font-medium">กำลังโหลดข้อมูลแดชบอร์ด...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 opacity-100 transition-opacity duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-600 dark:border-blue-500 pl-3">ภาพรวมระบบ (Dashboard)</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-4">ข้อมูลสรุปการตรวจสอบสลิปโอนเงินทั้งหมดของคุณ</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center shadow-sm border border-red-200 dark:border-red-800/50 font-medium">
                    <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-out"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-inner">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">ใบเสร็จปกติ</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10 mt-2">ยอดสลิปทั้งหมด (ใบ)</h3>
                    <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-1 relative z-10">{stats.total_slips.toLocaleString('th-TH')}</p>
                </div>

                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-out"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="h-10 w-10 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shadow-inner">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-800">รวมรายรับ</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10 mt-2">ยอดเงินรวม (บาท)</h3>
                    <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mt-1 relative z-10">฿{formatMoney(stats.total_amount)}</p>
                </div>

                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-out"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shadow-inner">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        {stats.fake_count > 0 && <span className="absolute top-0 right-10 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">ตรวจสอบพบ</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10 mt-2">สลิปปลอม (ใบ)</h3>
                    <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1 relative z-10">{stats.fake_count.toLocaleString('th-TH')}</p>
                </div>

                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500 ease-out"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="h-10 w-10 bg-yellow-50 dark:bg-yellow-900/50 text-yellow-500 dark:text-yellow-400 rounded-xl flex items-center justify-center shadow-inner">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-800">ประวัติซ้ำซ้อน</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10 mt-2">สลิปซ้ำ (ใบ)</h3>
                    <p className="text-3xl font-extrabold text-yellow-500 dark:text-yellow-400 mt-1 relative z-10">{stats.dup_count.toLocaleString('th-TH')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* ── Trend Chart ── */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">แนวโน้มยอดรับเงิน</h2>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                            <button onClick={() => handleChartModeChange('daily')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${chartMode === 'daily' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>รายวัน</button>
                            <button onClick={() => handleChartModeChange('weekly')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${chartMode === 'weekly' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>รายสัปดาห์</button>
                            <button onClick={() => handleChartModeChange('monthly')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${chartMode === 'monthly' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>รายเดือน</button>
                        </div>
                    </div>

                    <div className="w-full h-80 mt-2 flex-grow">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme === 'dark' ? '#818cf8' : '#4f46e5'} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme === 'dark' ? '#818cf8' : '#4f46e5'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f1f5f9'} />
                                    <XAxis
                                        dataKey={chartMode === 'daily' ? 'date' : chartMode === 'weekly' ? 'week_start' : 'month'}
                                        tickFormatter={(val) => chartMode === 'daily' ? formatDate(val, 'short') : val}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: theme === 'dark' ? '#9ca3af' : '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: theme === 'dark' ? '#9ca3af' : '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                                        dx={-10}
                                    />
                                    <RechartsTooltip
                                        contentStyle={tooltipStyle}
                                        labelFormatter={(val) => chartMode === 'daily' ? formatDate(val) : val}
                                        formatter={(val) => [`฿${formatMoney(val)}`, 'ยอดเงิน']}
                                    />
                                    <Area type="monotone" dataKey="total_amount" stroke={theme === 'dark' ? '#818cf8' : '#4f46e5'} strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 flex-col">
                                <BarChart3 className="h-10 w-10 mb-2 opacity-20" />
                                <span>ยังไม่มีข้อมูลเพียงพอสำหรับกราฟนี้</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bank Ranking ── */}
                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <div className="flex items-center mb-6">
                        <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                            <BarChart3 className="h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">สัดส่วนธนาคาร (เรียงตามยอดเงิน)</h2>
                    </div>

                    <div className="w-full h-[220px]">
                        {bankRanking.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bankRanking} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={theme === 'dark' ? '#374151' : '#f1f5f9'} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="bank_name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#475569', fontSize: 12 }} width={90} />
                                    <RechartsTooltip
                                        cursor={{ fill: theme === 'dark' ? '#374151' : '#f8fafc' }}
                                        contentStyle={tooltipStyle}
                                        formatter={(val, name) => [name === 'total_amount' ? `฿${formatMoney(val)}` : val, name === 'total_amount' ? 'ยอดเงิน' : 'จำนวนสลิป']}
                                    />
                                    <Bar dataKey="total_amount" radius={[0, 4, 4, 0]} barSize={20}>
                                        {bankRanking.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                                <span>ยังไม่มีข้อมูลสัดส่วนธนาคาร</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
                        {bankRanking.map((bank, idx) => (
                            <div key={idx} className="flex justify-between items-center mb-2 text-sm">
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[120px]" title={bank.bank_name}>{bank.bank_name || 'ไม่ระบุ'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-900 dark:text-white">฿{formatMoney(bank.total_amount)}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({bank.slip_count} ใบ)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Recent Transactions ── */}
            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-transparent">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 mr-3">
                            <Clock className="h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">รายการสลิปล่าสุด</h2>
                    </div>
                    <button onClick={() => navigate('/slips')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">
                        ดูทั้งหมด &rarr;
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-white/5 dark:backdrop-blur-xl/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold tracking-wider">#ID</th>
                                <th className="px-6 py-3.5 font-semibold tracking-wider">วันเวลาที่ทำรายการ</th>
                                <th className="px-6 py-3.5 font-semibold tracking-wider">ผู้โอน</th>
                                <th className="px-6 py-3.5 font-semibold tracking-wider">ธนาคาร</th>
                                <th className="px-6 py-3.5 font-semibold tracking-wider text-right">จำนวนเงิน</th>
                                <th className="px-6 py-3.5 font-semibold tracking-wider text-center">สถานะการตรวจสอบ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {recentSlips.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-white/5 dark:backdrop-blur-xl/30">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="h-8 w-8 mb-2 opacity-20 text-gray-400 dark:text-gray-500" />
                                            <span>ไม่มีรายการสลิปล่าสุดในระบบ</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentSlips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300 group cursor-pointer">
                                        <td className="px-6 py-4 font-mono text-gray-400 dark:text-gray-500 text-xs">#{slip.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{formatDate(slip.created_at).split(' ')[0]}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDate(slip.created_at).split(' ')[1]}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{slip.sender_name || <span className="text-gray-400 dark:text-gray-500 font-normal italic">ไม่ระบุ</span>}</td>
                                        <td className="px-6 py-4">
                                            {slip.bank_name ? (
                                                <div className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full mr-2 bg-gray-300 dark:bg-gray-600"></span>
                                                    {slip.bank_name}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                            {slip.amount != null ? formatMoney(slip.amount) + ' ฿' : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {slip.is_fake ? (
                                                <span className="inline-flex items-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-red-200 dark:border-red-800/50 shadow-sm">
                                                    <AlertTriangle className="w-3 h-3 mr-1" /> ปลอมแปลง
                                                </span>
                                            ) : slip.is_duplicate ? (
                                                <span className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                                                    <FileText className="w-3 h-3 mr-1" /> ใช้ซ้ำ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200 dark:border-green-800/50 shadow-sm">
                                                    ปกติ
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
