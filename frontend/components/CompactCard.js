'use client';

import { useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '../lib/utils';
import NewsModal from './NewsModal';

/**
 * CompactCard Component
 * List-style card with square thumbnail on the left.
 * Clicking anywhere on the card opens the summary modal.
 * Used in Hero sidebar, Must Read sidebar, and "Otras noticias" section.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.article
 */
export default function CompactCard({ article }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageUrl = normalizeImage(article.image_url);
    const relativeTime = getRelativeTime(article.published_time);

    return (
        <>
            <article
                className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0 group cursor-pointer"
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
                {/* Square Thumbnail (left) */}
                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                            e.target.classList.replace('object-cover', 'object-contain');
                            e.target.style.backgroundColor = '#1a1a2e';
                            e.target.style.padding = '0.5rem';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Portal & Time */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-[#E85D56] uppercase tracking-wide">
                            {article.portal}
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[11px] text-gray-400 font-medium">{relativeTime}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#E85D56] transition-colors">
                        {article.title}
                    </h4>

                    {/* Category + Country */}
                    <div className="flex items-center gap-2 mt-2">
                        {article.category && (
                            <span className="text-[11px] font-semibold text-[#E85D56]">
                                {article.category}
                            </span>
                        )}
                        {article.country && (
                            <>
                                <span className="text-[11px] text-gray-400">•</span>
                                <span className="text-[11px] text-gray-500 font-medium">
                                    {article.country}
                                </span>
                            </>
                        )}
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
