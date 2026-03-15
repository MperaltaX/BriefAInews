'use client';

import { useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '../lib/utils';
import NewsModal from './NewsModal';

/**
 * PortalHeroCard Component
 * Magazine-style horizontal card: large image on the left, content on the right.
 * Used as the lead story for each portal section.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.article
 */
export default function PortalHeroCard({ article }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageUrl = normalizeImage(article.image_url);
    const relativeTime = getRelativeTime(article.published_time);

    const publishedDate = article.published_time
        ? new Date(article.published_time).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '';

    return (
        <>
            <article
                className="portal-hero-card group cursor-pointer"
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
                {/* Image Side */}
                <div className="portal-hero-card__image">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                            e.target.classList.replace('object-cover', 'object-contain');
                            e.target.style.backgroundColor = '#1a1a2e';
                            e.target.style.padding = '2rem';
                        }}
                    />
                    {/* Gradient overlay for mobile stacked layout */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
                </div>

                {/* Content Side */}
                <div className="portal-hero-card__content">
                    {/* Portal Badge */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D56]/10 text-[#E85D56] text-xs font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E85D56] animate-pulse" />
                            {article.portal}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{relativeTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-3 group-hover:text-[#E85D56] transition-colors duration-300">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed line-clamp-3 mb-4">
                        {article.excerpt}
                    </p>

                    {/* Bottom Meta */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            {article.country && (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    {article.country}
                                </span>
                            )}
                            {article.category && (
                                <span className="text-xs font-semibold text-[#E85D56] bg-[#E85D56]/5 px-2 py-0.5 rounded">
                                    {article.category}
                                </span>
                            )}
                            <span className="text-xs text-gray-400">{publishedDate}</span>
                        </div>
                        <span className="text-xs font-bold text-[#E85D56] group-hover:translate-x-1 transition-transform duration-300">
                            Leer más →
                        </span>
                    </div>
                </div>
            </article>

            <NewsModal
                article={article}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
