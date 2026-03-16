'use client';

import { useEffect, useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '@/lib/utils';

/**
 * NewsModal Component
 * Reusable modal overlay to show the full summary of a news article.
 * Includes image header, portal badge, title, excerpt, and a link to the original article.
 * @param {Object} props
 * @param {import('@/lib/utils').INews} props.article - The news article to display
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {() => void} props.onClose - Callback to close the modal
 */
export default function NewsModal({ article, isOpen, onClose }) {
    const imageUrl = normalizeImage(article?.image_url);
    const relativeTime = getRelativeTime(article?.published_time);

    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState(null);
    const [aiError, setAiError] = useState(null);

    /* ── Lock body scroll when the modal is open ── */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (article?.ai_content) {
                setAiSummary(article.ai_content);
            }
        } else {
            document.body.style.overflow = '';
            // Reset AI states on close
            setAiSummary(null);
            setAiError(null);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, article]);

    /* ── Close on Escape key ── */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleGenerateSummary = async () => {
        if (!article) return;
        setIsGeneratingSummary(true);
        setAiError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            // Use article content or excerpt as fallback
            const contentToSummarize = article.content || article.excerpt;

            const response = await fetch(`${apiUrl}/api/ai/summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSummarize, id_article: article.id_article })
            });

            const data = await response.json();

            if (data.success) {
                setAiSummary(data.data);
            } else {
                setAiError(data.message || 'Error al generar el resumen con inteligencia artificial.');
            }
        } catch (error) {
            console.error('AI Summary Error:', error);
            setAiError('Error de conexión al conectar con los servicios de IA.');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    if (!isOpen || !article) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modal-overlay"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-content flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header — Image */}
                <div className="relative h-52 shrink-0 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                            e.target.classList.replace('object-cover', 'object-contain');
                            e.target.style.backgroundColor = '#1a1a2e';
                            e.target.style.padding = '1.5rem';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
                        aria-label="Cerrar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {/* Portal Badge + Country */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
                        <span className="text-xs font-bold text-[#E85D56] bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                            {article.portal}
                        </span>
                        {article.country && (
                            <>
                                <span className="text-xs text-white/60">•</span>
                                <span className="text-xs font-medium text-white/90">
                                    {article.country}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <h4 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                        {article.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-gray-600 leading-relaxed text-[15px] mb-2">
                        {article.excerpt}
                    </p>

                    {/* Country Tag */}
                    {article.country && (
                        <div className="flex items-center gap-2 mt-4 mb-4">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">País:</span>
                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                                {article.country}
                            </span>
                        </div>
                    )}

                    {/* AI Summary Section */}
                    {isGeneratingSummary && (
                        <div className="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-indigo-100/60 shadow-inner relative overflow-hidden transition-all duration-300">
                            {/* Animated Background Shine */}
                            <div className="absolute top-0 left-[-100%] right-0 bottom-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[flow_2s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                                </span>
                                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse tracking-wide uppercase">
                                    Analizando y resumiendo...
                                </span>
                            </div>

                            {/* Futuristic Skeletons */}
                            <div className="space-y-4 relative z-10">
                                <div className="h-2.5 bg-indigo-200/50 rounded-full w-full animate-pulse" />
                                <div className="h-2.5 bg-indigo-200/50 rounded-full w-[90%] animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="h-2.5 bg-indigo-200/50 rounded-full w-[75%] animate-pulse" style={{ animationDelay: '0.4s' }} />
                                <div className="h-2.5 bg-indigo-200/50 rounded-full w-[85%] animate-pulse" style={{ animationDelay: '0.6s' }} />
                            </div>
                        </div>
                    )}

                    {aiError && (
                        <div className="mt-5 bg-red-50 text-red-600 text-sm font-medium p-4 rounded-xl border border-red-200 flex items-start gap-3">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{aiError}</span>
                        </div>
                    )}

                    {aiSummary && !isGeneratingSummary && (
                        <div className="mt-6 bg-gradient-to-br from-[#0B0F19] to-[#1A1F35] rounded-2xl p-6 border border-[#2D3748] shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-indigo-900/20">
                            {/* Futuristic Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

                            <div className="flex items-center gap-2 mb-4 relative z-10 border-b border-indigo-500/20 pb-3">
                                <span className="text-xl animate-pulse">✨</span>
                                <h5 className="text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 uppercase tracking-widest">
                                    Resumen Inteligente
                                </h5>
                            </div>

                            <div className="text-[14px] text-gray-300 leading-relaxed font-normal relative z-10 space-y-4">
                                {aiSummary.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                                    <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-indigo-400 first-letter:mr-1 first-letter:float-left">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions Footer */}
                    <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[13px] font-medium text-gray-400 self-start sm:self-auto flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {relativeTime}
                        </span>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {!aiSummary && !isGeneratingSummary && (
                                <button
                                    onClick={handleGenerateSummary}
                                    className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-indigo-600 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 flex-1 sm:flex-none transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span className="animate-pulse">✨</span> Resumen AI
                                </button>
                            )}
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[#E85D56] hover:bg-[#d14a43] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-red-500/20 text-center flex-1 sm:flex-none transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Leer completo
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes flow {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #E2E8F0;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
