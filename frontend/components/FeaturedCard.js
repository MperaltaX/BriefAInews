'use client';

import { useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '../lib/utils';
import NewsModal from './NewsModal';

/**
 * FeaturedCard Component
 * Hero-style card with full image background, gradient overlay, and text on top.
 * Clicking anywhere on the card opens the summary modal.
 * Used in the main Hero section.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.article
 */
export default function FeaturedCard({ article }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageUrl = normalizeImage(article.image_url);
    const relativeTime = getRelativeTime(article.published_time);

    const publishedDate = article.published_time
        ? new Date(article.published_time).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        })
        : '';

    return (
        <>
            <article
                className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden group cursor-pointer"
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
                {/* Background Image */}
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover img-zoom"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                        e.target.classList.replace('object-cover', 'object-contain');
                        e.target.style.backgroundColor = '#1a1a2e';
                        e.target.style.padding = '2rem';
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {/* Portal & Time */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {article.portal}
                        </span>
                        <span className="text-white/70 text-xs font-medium">{relativeTime}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight mb-3 hover:underline decoration-2 underline-offset-4">
                        {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 max-w-lg">
                        {article.excerpt}
                    </p>

                    {/* Date */}
                    <div className="flex items-center justify-between">
                        <span className="text-white/50 text-xs font-medium">{publishedDate}</span>
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
