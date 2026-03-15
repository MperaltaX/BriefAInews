'use client';

import { useEffect } from 'react';
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

    /* ── Lock body scroll when the modal is open ── */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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

    if (!isOpen || !article) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modal-overlay"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header — Image */}
                <div className="relative h-52 overflow-hidden">
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
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
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
                        <span className="text-xs font-bold text-[#E85D56]">
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
                <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 leading-tight mb-3">
                        {article.title}
                    </h4>

                    <p className="text-gray-600 leading-relaxed text-sm">
                        {article.excerpt}
                    </p>

                    {/* Country Tag */}
                    {article.country && (
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">País:</span>
                            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                                {article.country}
                            </span>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{relativeTime}</span>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-[#E85D56] hover:bg-[#d14a43] text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            Ver artículo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
