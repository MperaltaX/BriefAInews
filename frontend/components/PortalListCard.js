'use client';

import { useState } from 'react';
import { getRelativeTime } from '../lib/utils';
import NewsModal from './NewsModal';

/**
 * PortalListCard Component
 * Minimalist newspaper-headline style card with accent left border and order number.
 * No image — purely typographic/editorial. Used for secondary stories per portal.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.article
 * @param {number} props.index - Position number to display (1-based)
 */
export default function PortalListCard({ article, index }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const relativeTime = getRelativeTime(article.published_time);

    return (
        <>
            <article
                className="portal-list-card group cursor-pointer"
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
                {/* Order Number */}
                <span className="portal-list-card__number">
                    {String(index).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#E85D56] transition-colors duration-200">
                        {article.title}
                    </h4>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-2">
                        {article.country && (
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {article.country}
                            </span>
                        )}
                        {article.category && (
                            <span className="text-[11px] font-semibold text-[#E85D56]">
                                {article.category}
                            </span>
                        )}
                        <span className="text-[11px] text-gray-300">•</span>
                        <span className="text-[11px] text-gray-400 font-medium">{relativeTime}</span>
                    </div>
                </div>

                {/* Arrow */}
                <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-[#E85D56] group-hover:translate-x-1 transition-all duration-200 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </article>

            <NewsModal
                article={article}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
