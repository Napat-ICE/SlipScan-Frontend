import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileType, CheckCircle, XCircle, Trash2, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Basic auth check
        if (!sessionStorage.getItem('slipscan_token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFiles = (newFiles) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validFiles = Array.from(newFiles).filter(
            file => validTypes.includes(file.type) && file.size <= maxSize
        );

        if (files.length + validFiles.length > 20) {
            alert(`เลือกได้สูงสุด 20 ไฟล์ (ปัจจุบัน ${files.length} ไฟล์)`);
            return;
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateFiles(e.target.files);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        if (files.length === 1) setResults(null);
    };

    const clearAll = () => {
        setFiles([]);
        setResults(null);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        setResults(null);
        setProgress(0);

        const token = sessionStorage.getItem('slipscan_token');
        const uploadResults = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.post('/api/slips/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                uploadResults.push({ file: file.name, ok: true, data: response.data });
            } catch (error) {
                uploadResults.push({
                    file: file.name,
                    ok: false,
                    error: error.response?.data?.message || error.message || 'Upload failed'
                });
            }
            setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        setResults(uploadResults);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block">อัพโหลดสลิป</h1>
            </div>

            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 shadow-sm transition-colors duration-200">
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">รองรับ jpg, png, webp • สูงสุด 10MB ต่อไฟล์ • ไม่เกิน 20 ไฟล์ต่อครั้ง</p>

                <div
                    className={`relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleChange}
                        className="hidden"
                    />
                    <UploadCloud className="mb-4 h-14 w-14 text-blue-500 dark:text-blue-400" />
                    <p className="mb-1 text-lg font-medium text-gray-700 dark:text-gray-200">คลิก หรือ ลากสลิปมาวางที่นี่</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">รองรับไฟล์สลิปจากทุกธนาคารในไทย</p>
                </div>

                {files.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">ไฟล์ที่เลือก ({files.length})</h3>
                            <button
                                onClick={clearAll}
                                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> ล้างทั้งหมด
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                            {files.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="relative group rounded-lg border border-gray-200 dark:border-gray-700 p-2 shadow-sm bg-gray-50 dark:bg-white/5 dark:backdrop-blur-xl overflow-hidden transition-colors duration-200">
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            className="bg-white dark:bg-white/5 dark:backdrop-blur-xl text-red-500 dark:text-red-400 rounded-full p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <img src={URL.createObjectURL(file)} alt="preview" className="h-20 w-full object-cover rounded mb-2 relative z-0" />
                                    <p className="truncate text-xs text-gray-600 dark:text-gray-400 font-medium px-1 relative z-0" title={file.name}>{file.name}</p>
                                </div>
                            ))}
                        </div>

                        {loading && (
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>กำลังประมวลผล...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:text-gray-200 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <><span className="animate-spin rounded-full border-2 border-white dark:border-gray-200 border-t-transparent h-4 w-4 mr-2"></span> กำลังวิเคราะห์...</>
                                ) : (
                                    <><FileType className="mr-2 h-4 w-4" /> เริ่มวิเคราะห์สลิป</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {results && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-white/5 dark:backdrop-blur-xl p-6 shadow-sm animate-fade-in-up transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-green-500 pb-2 inline-block">ผลการวิเคราะห์</h2>

                        {/* Summary Badges */}
                        <div className="flex flex-wrap gap-2">
                            {results.filter(r => r.ok && r.data?.success).length > 0 && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                                    {results.filter(r => r.ok && r.data?.success).length} สำเร็จ
                                </span>
                            )}
                            {results.filter(r => !r.ok || !r.data?.success).length > 0 && (
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800/50">
                                    {results.filter(r => !r.ok || !r.data?.success).length} ล้มเหลว
                                </span>
                            )}
                            {results.filter(r => r.data?.data?.is_fake).length > 0 && (
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-300 dark:border-red-700/50 flex items-center shadow-sm">
                                    <AlertCircle className="w-3 h-3 mr-1" /> {results.filter(r => r.data?.data?.is_fake).length} ปลอม
                                </span>
                            )}
                            {results.filter(r => r.data?.is_duplicate).length > 0 && (
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-300 dark:border-yellow-700/50">
                                    {results.filter(r => r.data?.is_duplicate).length} ซ้ำ
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {results.map((result, idx) => {
                            const isOk = result.ok && result.data?.success;
                            const d = result.data?.data || {};
                            const warns = result.data?.warnings || [];
                            const isFake = d.is_fake;
                            const isDup = result.data?.is_duplicate;

                            return (
                                <div key={idx} className={`rounded-xl border ${isOk ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/50' : 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20'} overflow-hidden transition-colors`}>
                                    <div className={`flex items-center gap-3 px-5 py-3 border-b ${isOk ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30'}`}>
                                        {isOk ? <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" /> : <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />}
                                        <span className={`font-medium text-sm flex-1 truncate ${isOk ? 'text-gray-800 dark:text-gray-200' : 'text-red-800 dark:text-red-300'}`}>{result.file}</span>

                                        <div className="flex gap-2">
                                            {isFake && <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800/50">ปลอม</span>}
                                            {isDup && <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-500 text-xs px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800/50">ซ้ำ</span>}
                                            {d.slip_id && <span className="text-gray-400 dark:text-gray-500 text-xs font-mono ml-2">#{d.slip_id}</span>}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        {isOk ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                                <div><span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">ผู้โอน</span><span className="font-medium text-gray-900 dark:text-white">{d.sender_name || '-'}</span></div>
                                                <div><span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">ผู้รับ</span><span className="font-medium text-gray-900 dark:text-white">{d.receiver_name || '-'}</span></div>
                                                <div><span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">ธนาคาร</span><span className="font-medium text-gray-900 dark:text-white">{d.bank_name || '-'}</span></div>
                                                <div><span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">เลขบัญชีรับ</span><span className="font-medium font-mono text-gray-900 dark:text-white">{d.receiver_acct || '-'}</span></div>
                                                <div><span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">จำนวนเงิน</span><span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{d.amount != null ? Number(d.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 }) + ' ฿' : '-'}</span></div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">วันที่ / เวลา</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{d.slip_date || '-'} {d.slip_time || '-'}</span>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <span className="text-gray-500 dark:text-gray-400 block text-xs mb-1">Ref No.</span>
                                                    <span className="font-mono text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">{d.ref_no || '-'}</span>
                                                </div>

                                                {warns.length > 0 && (
                                                    <div className="md:col-span-2 mt-2 space-y-1">
                                                        {warns.map((w, i) => (
                                                            <div key={i} className="inline-flex items-center bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50 text-xs px-2 py-1 rounded mr-2">
                                                                <AlertTriangle className="w-3 h-3 mr-1" /> {w}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Raw OCR Data Toggle */}
                                                {result.data?.raw_ocr && (
                                                    <div className="md:col-span-2 mt-3">
                                                        <button
                                                            onClick={() => {
                                                                const el = document.getElementById(`ocr-raw-${idx}`);
                                                                if (el) el.classList.toggle('hidden');
                                                            }}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                                                        >
                                                            <FileType className="w-3 h-3" /> ดูข้อมูล OCR ดิบ
                                                        </button>
                                                        <div id={`ocr-raw-${idx}`} className="hidden mt-2 p-3 bg-gray-900 dark:bg-black/60 text-green-400 text-xs font-mono rounded-lg max-h-64 overflow-auto whitespace-pre-wrap border border-gray-700">
                                                            {typeof result.data.raw_ocr === 'string' ? result.data.raw_ocr : JSON.stringify(result.data.raw_ocr, null, 2)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{result.error || result.data?.message || 'การวิเคราะห์ผิดพลาด'}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
