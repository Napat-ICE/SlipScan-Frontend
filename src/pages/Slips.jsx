import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, AlertTriangle, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Slips = () => {
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, normal, fake, duplicate

    const navigate = useNavigate();
    const { theme } = useTheme();

    const fetchSlips = useCallback(async () => {
        const token = sessionStorage.getItem('slipscan_token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams({
                page,
                per_page: perPage
            });

            if (searchQuery) params.append('q', searchQuery);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);

            if (statusFilter === 'fake') params.append('is_fake', 'true');
            if (statusFilter === 'duplicate') params.append('is_duplicate', 'true');
            if (statusFilter === 'normal') {
                params.append('is_fake', 'false');
                params.append('is_duplicate', 'false');
            }

            const response = await api.get(`/api/slips/list?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSlips(response.data.data);
                setTotal(response.data.total);
            }
        } catch (err) {
            console.error(err);
            setError('ไม่สามารถโหลดข้อมูลสลิปได้');
        } finally {
            setLoading(false);
        }
    }, [page, perPage, searchQuery, dateFrom, dateTo, statusFilter, navigate]);

    useEffect(() => {
        fetchSlips();
    }, [fetchSlips]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSlips();
    };

    const handleExport = async () => {
        const token = sessionStorage.getItem('slipscan_token');
        if (!token) return;

        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);
            if (statusFilter === 'fake') params.append('is_fake', 'true');
            if (statusFilter === 'duplicate') params.append('is_duplicate', 'true');
            if (statusFilter === 'normal') {
                params.append('is_fake', 'false');
                params.append('is_duplicate', 'false');
            }

            const response = await api.get(`/api/slips/export?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `slips_export_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export error:', err);
            alert('ไม่สามารถส่งออกข้อมูลได้');
        }
    };

    const formatMoney = (amount) => {
        return Number(amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('th-TH');
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="space-y-8 animate-fade-in-up pb-8 opacity-100 transition-opacity duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">รายการสลิปทั้งหมด</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">ประวัติและข้อมูลสลิปโอนเงินทั้งหมด ({total} รายการ)</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-50 dark:from-white/5 dark:to-gray-800/20 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700/30 dark:hover:to-gray-600/20 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-semibold"
                >
                    <Download className="h-5 w-5" /> Export CSV
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center shadow-sm border border-red-200 dark:border-red-800/50 font-medium">
                    <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-white/5 dark:to-blue-900/10 p-6 rounded-3xl shadow-lg border border-blue-100 dark:border-blue-800/30 hover:shadow-2xl transition-all duration-500">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ค้นหา (ชื่อผู้โอน/ผู้รับ)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาชื่อ..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 text-sm font-medium transition-all duration-300"
                            />
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ตั้งแต่วันที่</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-300"
                            />
                            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ถึงวันที่</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all duration-300 cursor-pointer"
                            />
                            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">สถานะ</label>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium appearance-none transition-all duration-300"
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="normal">ปกติ</option>
                                <option value="fake">สลิปปลอม</option>
                                <option value="duplicate">สลิปซ้ำ</option>
                            </select>
                            <Filter className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <button type="submit" className="hidden">Submit</button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-gray-900/10 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading && slips.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/20 dark:to-white/5 border-b border-gray-100 dark:border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">#ID</th>
                                    <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">วันเวลาที่ทำรายการ</th>
                                    <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">ผู้โอน</th>
                                    <th className="px-6 py-5 font-bold tracking-wider whitespace-nowrap">ธนาคาร</th>
                                    <th className="px-6 py-5 font-bold tracking-wider text-right whitespace-nowrap">จำนวนเงิน</th>
                                    <th className="px-6 py-5 font-bold tracking-wider text-center whitespace-nowrap">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {slips.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-white/5 dark:backdrop-blur-xl/30">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="h-12 w-12 mb-4 opacity-20" />
                                                <span className="text-base font-medium">ไม่พบข้อมูลสลิปที่ตรงกับเงื่อนไข</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    slips.map((slip) => (
                                        <tr key={slip.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300 text-gray-700 dark:text-gray-300">
                                            <td className="px-6 py-5 font-mono text-gray-400 dark:text-gray-500 text-xs">#{slip.user_sequence || slip.id}</td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(slip.created_at).split(' ')[0]}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(slip.created_at).split(' ')[1]}</div>
                                            </td>
                                            <td className="px-6 py-5 font-semibold text-gray-800 dark:text-gray-200">{slip.sender_name || <span className="text-gray-400 dark:text-gray-500 font-normal italic">ไม่ระบุ</span>}</td>
                                            <td className="px-6 py-5 whitespace-nowrap truncate max-w-[150px]">
                                                {slip.bank_name || '-'}
                                            </td>
                                            <td className="px-6 py-5 text-right font-black text-gray-900 dark:text-white whitespace-nowrap">
                                                {slip.amount != null ? formatMoney(slip.amount) + ' ฿' : '-'}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {slip.is_fake ? (
                                                    <span className="inline-flex items-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/50">
                                                        ปลอมแปลง
                                                    </span>
                                                ) : slip.is_duplicate ? (
                                                    <span className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-200 dark:border-yellow-800/50">
                                                        ใช้ซ้ำ
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800/50">
                                                        ปกติ
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/20 dark:to-white/5">
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            แสดง {((page - 1) * perPage) + 1} ถึง {Math.min(page * perPage, total)} จากทั้งหมด {total} รายการ
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> ก่อนหน้า
                            </button>
                            <div className="flex items-center px-4 font-bold text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-xl">
                                หน้า {page} / {totalPages}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                            >
                                ถัดไป <ChevronRight className="h-4 w-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slips;
