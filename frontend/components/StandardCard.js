'use client';

import { useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '../lib/utils';
import NewsModal from './NewsModal';

/**
 * StandardCard Component
 * Card with image on top, portal info, title, excerpt, and category.
 * Clicking anywhere on the card opens the summary modal.
 * Used in Latest News and Weekly Highlight sections.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.article
 */
export default function StandardCard({ article }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageUrl = normalizeImage(article.image_url);
    const relativeTime = getRelativeTime(article.published_time);

    return (
        <>
            <article
                className="flex flex-col bg-white rounded-2xl overflow-hidden card-hover cursor-pointer"
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsModalOpen(true);
                    }
                }}
            >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover img-zoom"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                            e.target.classList.replace('object-cover', 'object-contain');
                            e.target.style.backgroundColor = '#1a1a2e';
                            e.target.style.padding = '1.5rem';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Portal & Time */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-bold text-gray-600 uppercase">
                                {article.portal?.charAt(0) || 'N'}
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-800">{article.portal}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{relativeTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 hover:text-[#E85D56] transition-colors">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-grow">
                        {article.excerpt}
                    </p>

                    {/* Category + Country */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                            {article.category && (
                                <span className="text-xs font-semibold text-[#E85D56]">
                                    {article.category}
                                </span>
                            )}
                            {article.country && (
                                <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {article.country}
                                    </span>
                                </>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-500 hover:text-[#E85D56] transition-colors">
                            Leer más →
                        </span>
                    </div>
                </div>
            </article>

            {/* Summary Modal */}
            <NewsModal
                article={article}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
